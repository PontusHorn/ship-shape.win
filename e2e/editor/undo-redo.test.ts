import { expect, test } from '../test-api';
import {
	getVertices,
	getOutputShapeCommands,
	getElementCenter,
	getTools,
	drag,
	getAddVertexButtons,
	getControlPoints
} from '../helpers';
import { translate } from '$lib/util/vector';

test.describe('Editor - Undo/Redo', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');
	});

	test('should undo and redo vertex addition', async ({ page }) => {
		// Get initial vertices count (should be 3)
		await expect(getVertices(page)).toHaveCount(3);

		// Get initial shape commands
		const initialCommands = await getOutputShapeCommands(page);

		// Add a vertex by clicking an insert handle
		const addVertexHandle = getAddVertexButtons(page).first();
		await addVertexHandle.click();

		// Verify vertex was added and shape commands changed
		await expect(getVertices(page)).toHaveCount(4);
		const afterAddCommands = await getOutputShapeCommands(page);
		expect(afterAddCommands).not.toEqual(initialCommands);

		// Undo with Ctrl+Z
		await page.keyboard.press('ControlOrMeta+z');

		// Verify we're back to initial state
		await expect(getVertices(page)).toHaveCount(3);
		expect(await getOutputShapeCommands(page)).toEqual(initialCommands);

		// Redo with Ctrl+Y
		await page.keyboard.press('ControlOrMeta+y');

		// Verify vertex was re-added and shape commands match after-add state
		await expect(getVertices(page)).toHaveCount(4);
		expect(await getOutputShapeCommands(page)).toEqual(afterAddCommands);
	});

	test('should undo and redo vertex deletion', async ({ page }) => {
		// First add a vertex so we can delete it without hitting the minimum limit
		await getAddVertexButtons(page).first().click();

		await expect(getVertices(page)).toHaveCount(4);

		// Get state after vertex addition
		const afterAddCommands = await getOutputShapeCommands(page);

		// Delete the first vertex using Alt+click
		await getVertices(page)
			.first()
			.click({ modifiers: ['Alt'] });

		// Verify vertex was deleted
		await expect(getVertices(page)).toHaveCount(3);

		// Get state after deletion
		const afterDeleteCommands = await getOutputShapeCommands(page);
		expect(afterDeleteCommands).not.toEqual(afterAddCommands);

		// Undo deletion with Ctrl+Z
		await page.keyboard.press('ControlOrMeta+z');

		// Verify vertex and shape commands were restored
		await expect(getVertices(page)).toHaveCount(4);
		expect(await getOutputShapeCommands(page)).toEqual(afterAddCommands);

		// Redo deletion with Ctrl+Shift+Z
		await page.keyboard.press('ControlOrMeta+Shift+z');

		// Verify vertex was deleted again and shape commands match after-deletion state
		await expect(getVertices(page)).toHaveCount(3);
		expect(await getOutputShapeCommands(page)).toEqual(afterDeleteCommands);
	});

	test('should undo and redo vertex movement', async ({ page }) => {
		// Get initial shape commands
		const initialCommands = await getOutputShapeCommands(page);

		// Move the first vertex
		const targetVertex = getVertices(page).first();
		const vertexPos = await getElementCenter(targetVertex);
		const targetPos = translate(vertexPos, [100, 100]);

		await expect(targetVertex).toBeEnabled(); // Ensure vertex is actionable
		await drag(page, vertexPos, targetPos);

		// Wait for undo button to be enabled since the next assertion doesn't auto-wait
		const undoButton = page.getByRole('button', { name: 'Undo' });
		await expect(undoButton).toBeEnabled();

		// Verify shape commands changed
		const afterMoveCommands = await getOutputShapeCommands(page);
		expect(afterMoveCommands).not.toEqual(initialCommands);

		// Undo with Ctrl+Z
		await page.keyboard.press('ControlOrMeta+z');

		// Verify shape commands reverted
		const afterUndoCommands = await getOutputShapeCommands(page);
		expect(afterUndoCommands).toEqual(initialCommands);

		// Redo with Ctrl+Y
		await page.keyboard.press('ControlOrMeta+y');

		// Verify shape commands match after-move state
		const afterRedoCommands = await getOutputShapeCommands(page);
		expect(afterRedoCommands).toEqual(afterMoveCommands);
	});

	test('should handle multiple undos and redos', async ({ page }) => {
		// Get initial state
		await expect(getVertices(page)).toHaveCount(3);
		const initialCommands = await getOutputShapeCommands(page);

		// Perform multiple operations
		// Operation 1: Add vertex
		const addVertexHandle = getAddVertexButtons(page).first();
		await addVertexHandle.click();

		await expect(getVertices(page)).toHaveCount(4);
		const afterAdd1Commands = await getOutputShapeCommands(page);

		// Operation 2: Add another vertex
		const addVertexHandle2 = getAddVertexButtons(page).first();
		await addVertexHandle2.click();

		await expect(getVertices(page)).toHaveCount(5);
		const afterAdd2Commands = await getOutputShapeCommands(page);

		// Operation 3: Add control points
		await getTools(page).curve.click();
		await getVertices(page).first().click();

		await expect(getControlPoints(page)).toHaveCount(2);
		const afterMoveCommands = await getOutputShapeCommands(page);

		// Undo three times
		await page.keyboard.press('ControlOrMeta+z'); // Undo add control points
		await expect(getControlPoints(page)).toHaveCount(0);
		expect(await getOutputShapeCommands(page)).toEqual(afterAdd2Commands);

		await page.keyboard.press('ControlOrMeta+z'); // Undo second add
		await expect(getVertices(page)).toHaveCount(4);
		expect(await getOutputShapeCommands(page)).toEqual(afterAdd1Commands);

		await page.keyboard.press('ControlOrMeta+z'); // Undo first add
		await expect(getVertices(page)).toHaveCount(3);
		expect(await getOutputShapeCommands(page)).toEqual(initialCommands);

		// Redo three times
		await page.keyboard.press('ControlOrMeta+y'); // Redo first add
		await expect(getVertices(page)).toHaveCount(4);
		expect(await getOutputShapeCommands(page)).toEqual(afterAdd1Commands);

		await page.keyboard.press('ControlOrMeta+y'); // Redo second add
		await expect(getVertices(page)).toHaveCount(5);
		expect(await getOutputShapeCommands(page)).toEqual(afterAdd2Commands);

		await page.keyboard.press('ControlOrMeta+y'); // Redo add control points
		await expect(getControlPoints(page)).toHaveCount(2);
		expect(await getOutputShapeCommands(page)).toEqual(afterMoveCommands);
	});

	test('should clear redo stack when new change is made after undo', async ({ page }) => {
		// Both buttons should be disabled initially since both stacks are empty
		const undoButton = page.getByRole('button', { name: 'Undo' });
		const redoButton = page.getByRole('button', { name: 'Redo' });
		await expect(undoButton).toBeDisabled();
		await expect(redoButton).toBeDisabled();

		// Get initial state
		await expect(getVertices(page)).toHaveCount(3);

		// Add a vertex
		await getAddVertexButtons(page).first().click();
		await expect(getVertices(page)).toHaveCount(4);

		// The undo stack should now have an entry making its button enabled, but
		// the redo stack still empty and its button disabled.
		await expect(undoButton).toBeEnabled();
		await expect(redoButton).toBeDisabled();

		// Add another vertex
		await getAddVertexButtons(page).first().click();
		await expect(getVertices(page)).toHaveCount(5);

		// Undo once
		await undoButton.click();
		await expect(getVertices(page)).toHaveCount(4);

		// Both buttons should now be enabled as both stacks have one entry
		await expect(undoButton).toBeEnabled();
		await expect(redoButton).toBeEnabled();

		// Make a new change (this should clear the redo stack)
		await getTools(page).curve.click();
		await getVertices(page).first().click();

		// The redo stack should now be cleared, so its button should be disabled
		await expect(redoButton).toBeDisabled();

		// Try to redo - should do nothing since redo stack was cleared
		await page.keyboard.press('ControlOrMeta+y');
		await expect(getVertices(page)).toHaveCount(4);
	});

	test('should work with curve tool operations', async ({ page }) => {
		// Switch to curve tool
		await getTools(page).curve.click();

		// Click on a vertex to add control points
		await getVertices(page).first().click();

		const undoButton = page.getByRole('button', { name: 'Undo' });
		await expect(undoButton).toBeEnabled();

		// Verify control points were added
		await expect(getControlPoints(page)).toHaveCount(2);

		// Undo curve addition
		await undoButton.click();
		await expect(undoButton).toBeDisabled();

		// Verify control points were removed
		await expect(getControlPoints(page)).toHaveCount(0);

		// Redo curve addition
		await page.keyboard.press('ControlOrMeta+y');

		// Verify control points were added back
		await expect(getControlPoints(page)).toHaveCount(2);
	});
});
