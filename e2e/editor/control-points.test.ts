import { translate } from '../../src/lib/util/vector';
import { expect, test } from '../test-api';
import {
	drag,
	getControlPoints,
	getElementCenter,
	getOutputShapeCommands,
	getTools,
	getVertices
} from '../helpers';

// These tests are mostly expected to work the same in both the Select and Curve tools,
// so most of them loop over the tools and reruns its tests on each.

test.describe('Editor: Control points', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');

		// Create control points for the first vertex using the curve tool
		await getTools(page).curve.check();
		await getVertices(page).first().click();
	});

	for (const tool of ['select', 'curve'] as const) {
		test.describe(`${tool} tool`, () => {
			test('should move control point when dragging', async ({ page }) => {
				const tools = getTools(page);
				await tools[tool].click();

				const controlPoint = getControlPoints(page).first();
				const initialPos = await getElementCenter(controlPoint);

				// Drag control point
				await drag(page, initialPos, translate(initialPos, [30, 30]));

				// Control point should have moved
				const newPos = await getElementCenter(controlPoint);
				await expect(newPos).toBeCloseVector(translate(initialPos, [30, 30]));

				// Output code should reflect the control point moving from 60% 0% to 70% 10%
				// (moved 30px = 10% of 300px)
				const commands = await getOutputShapeCommands(page);
				expect(commands).toContainEqual('curve to 100% 100% with 70% 10%');
			});

			test('should mirror control points when dragging', async ({ page }) => {
				const tools = getTools(page);
				await tools[tool].click();

				const forward = getControlPoints(page, 'forward');
				const backward = getControlPoints(page, 'backward');
				const forwardPos = await getElementCenter(forward);
				const backwardPos = await getElementCenter(backward);

				// Drag forward control point
				const targetForwardPos = translate(forwardPos, [30, 20]);
				await drag(page, forwardPos, targetForwardPos);

				// Backward control point should have moved in opposite direction
				const newBackwardPos = await getElementCenter(backward);
				await expect(newBackwardPos).toBeCloseVector(translate(backwardPos, [-30, -20]));

				// Drag backward control point
				await drag(page, newBackwardPos, translate(newBackwardPos, [30, 20]));

				// Forward control point should have moved in opposite direction
				const newForwardPos = await getElementCenter(forward);
				await expect(newForwardPos).toBeCloseVector(translate(targetForwardPos, [-30, -20]));
			});

			test('should break mirroring when alt key is held', async ({ page }) => {
				const tools = getTools(page);
				await tools[tool].click();

				const forward = getControlPoints(page, 'forward');
				const backward = getControlPoints(page, 'backward');
				const forwardPos = await getElementCenter(forward);
				const backwardPos = await getElementCenter(backward);
				const targetPos = translate(forwardPos, [30, 20]);

				// Drag forward control point with Alt key held
				await page.keyboard.down('Alt');
				await drag(page, forwardPos, targetPos);
				await page.keyboard.up('Alt');

				// Backward control point should not have moved
				let newBackwardPos = await getElementCenter(backward);
				await expect(newBackwardPos).toBeCloseVector(backwardPos);

				// Drag again without Alt now that mirroring is disabled
				await drag(page, targetPos, translate(targetPos, [100, 0]));

				// Backward control point should still not have moved
				newBackwardPos = await getElementCenter(backward);
				await expect(newBackwardPos).toBeCloseVector(backwardPos);
			});

			test('should support keyboard navigation', async ({ page }) => {
				const forward = getControlPoints(page, 'forward');
				const backward = getControlPoints(page, 'backward');

				// The forward control point should be focused on creation
				await expect(forward).toBeFocused();

				// Tab should move to backward control point
				await page.keyboard.press('Tab');
				await expect(backward).toBeFocused();

				// Switch back to select tool and focus the first vertex
				await getTools(page).select.check();
				await getVertices(page).first().focus();

				// The control points should be next in the tabbing order
				await page.keyboard.press('Tab');
				await expect(forward).toBeFocused();
				await page.keyboard.press('Tab');
				await expect(backward).toBeFocused();
			});

			test('should move control points with arrow keys', async ({ page }) => {
				const tools = getTools(page);
				await tools[tool].click();

				// Focus a control point and get initial position
				const controlPoint = getControlPoints(page).first();
				await controlPoint.focus();
				const initialPos = await getElementCenter(controlPoint);

				// Use arrow keys to move
				await page.keyboard.press('ArrowRight');
				await page.keyboard.press('ArrowDown');

				// Position should have changed
				const newPos = await getElementCenter(controlPoint);
				expect(newPos[0]).toBeGreaterThan(initialPos[0]);
				expect(newPos[1]).toBeGreaterThan(initialPos[1]);
			});

			test('should handle control point deletion with Delete key', async ({ page }) => {
				const tools = getTools(page);
				await tools[tool].click();

				// Get the control points
				const controlPoints = getControlPoints(page);
				await expect(controlPoints).toHaveCount(2);

				// Delete control point with Delete key when focused
				const forwardControlPoint = getControlPoints(page, 'forward').nth(0);
				await forwardControlPoint.focus();
				await page.keyboard.press('Delete');

				const error = page.getByRole('alert');

				// Control point should be deleted with no error
				await expect(getControlPoints(page, 'forward')).toHaveCount(0);
				await expect(error).not.toBeVisible();

				// Vertex should still exist
				const vertices = getVertices(page);
				await expect(vertices).toHaveCount(3);

				// Try to delete when no control point focused (should do nothing)
				await page.keyboard.press('Delete');

				// Should still have the backward control point
				await expect(getControlPoints(page, 'backward')).toHaveCount(1);
				await expect(error).not.toBeVisible();
			});

			test('should handle control point deletion with Alt+click', async ({ page }) => {
				const tools = getTools(page);
				await tools[tool].click();

				// Get the control points
				const controlPoints = getControlPoints(page);
				await expect(controlPoints).toHaveCount(2);

				// Delete control point with Alt+click
				const forwardControlPoint = getControlPoints(page, 'forward').nth(0);
				await forwardControlPoint.click({ modifiers: ['Alt'] });

				const error = page.getByRole('alert');

				// Control point should be deleted with no error
				await expect(getControlPoints(page, 'forward')).toHaveCount(0);
				await expect(error).not.toBeVisible();

				// Vertex should still exist
				const vertices = getVertices(page);
				await expect(vertices).toHaveCount(3);

				// Regular click without Alt should not delete the remaining control point
				const backwardControlPoint = getControlPoints(page, 'backward').nth(0);
				await backwardControlPoint.click();

				// Should still have the backward control point and no error
				await expect(getControlPoints(page, 'backward')).toHaveCount(1);
				await expect(error).not.toBeVisible();
			});

			test('should handle control point deletion with form delete button', async ({ page }) => {
				const tools = getTools(page);
				await tools[tool].click();

				// Get the control points
				const controlPoints = getControlPoints(page);
				await expect(controlPoints).toHaveCount(2);

				// Select a control point to show the form
				const forwardControlPoint = getControlPoints(page, 'forward').nth(0);
				await forwardControlPoint.click();

				// Delete button should be visible and show "Delete control point"
				const deleteButton = page.getByRole('button', { name: /delete control point/i });
				await expect(deleteButton).toBeVisible();

				// Delete control point via form button
				await deleteButton.click();

				const error = page.getByRole('alert');

				// Control point should be deleted with no error
				await expect(getControlPoints(page, 'forward')).toHaveCount(0);
				await expect(error).not.toBeVisible();

				// Vertex should still exist
				const vertices = getVertices(page);
				await expect(vertices).toHaveCount(3);

				// Clear selection: button should not be visible
				await page.keyboard.press('Escape');
				await expect(deleteButton).not.toBeVisible();
			});
		});
	}
});
