import { translate } from '../src/lib/vector';
import { expect, test } from './test-api';
import {
	drag,
	getControlPoints,
	getElementCenter,
	getOutputShapeCommands,
	getTools,
	getVertices
} from './helpers';

test.describe('Editor: Select tool', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');
	});

	test('should select vertex when clicked', async ({ page }) => {
		const vertex = getVertices(page).first();
		await expect(vertex).toHaveAttribute('aria-pressed', 'false');

		await vertex.click();
		await expect(vertex).toHaveAttribute('aria-pressed', 'true');
	});

	test('should move vertex when dragged', async ({ page }) => {
		const vertex = getVertices(page).first();
		const vertexPos = await getElementCenter(vertex);

		// Drag the vertex
		const targetPos = translate(vertexPos, [60, 30]);
		await drag(page, vertexPos, targetPos);

		// Vertex should have moved
		const newVertexPos = await getElementCenter(vertex);
		await expect(newVertexPos).toBeCloseVector(targetPos);

		// Output code should reflect the new position
		const commands = await getOutputShapeCommands(page);
		expect(commands).toEqual([
			'from 70% 10%', // Moved from 50% 0% (30px = 10% of 300px)
			'line to 100% 100%',
			'line to 0% 100%',
			'line to 70% 10%'
		]);
	});

	test('should move vertex with arrow keys', async ({ page }) => {
		const vertex = getVertices(page).first();
		await vertex.focus();

		const initialPos = await getElementCenter(vertex);

		// Use arrow keys to move the vertex
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowDown');

		// Vertex should have moved
		const newPos = await getElementCenter(vertex);
		await expect(newPos).toBeCloseVector(translate(initialPos, [-10, 10]));

		// Output code should reflect the new position
		const commands = await getOutputShapeCommands(page);
		expect(commands).toEqual([
			'from 47% 3%', // Moved from 50% 0% (10px = 3% of 300px)
			'line to 100% 100%',
			'line to 0% 100%',
			'line to 47% 3%'
		]);
	});

	test('should support fine movement with Ctrl+arrow keys', async ({ page }) => {
		const vertex = getVertices(page).first();
		await vertex.focus();

		const initialPos = await getElementCenter(vertex);

		// Use Ctrl+arrow for fine movement
		await page.keyboard.press('Control+ArrowRight');

		// Should move only a small amount (1px step)
		const newPos = await getElementCenter(vertex);
		expect(newPos).toEqual(translate(initialPos, [1, 0]));
	});

	test('should support large movement with Shift+arrow keys', async ({ page }) => {
		const vertex = getVertices(page).first();
		await vertex.focus();

		const initialPos = await getElementCenter(vertex);

		// Use Shift+arrow for large movement
		await page.keyboard.press('Shift+ArrowRight');

		// Should move a larger amount (30px step)
		const newPos = await getElementCenter(vertex);
		await expect(newPos).toBeCloseVector(translate(initialPos, [30, 0]));
	});

	test('should move control points along with vertex', async ({ page }) => {
		const tools = getTools(page);

		// Create a vertex with control points using the curve tool
		await tools.curve.click();
		let vertex = getVertices(page).first();
		await vertex.click();

		// Switch back to select tool and focus the vertex
		await tools.select.click();
		vertex = getVertices(page).first();
		await vertex.focus();

		// Move the vertex with the arrow keys
		await page.keyboard.press('Shift+ArrowRight');
		await page.keyboard.press('Shift+ArrowDown');

		const commands = await getOutputShapeCommands(page);
		expect(commands).toEqual([
			'from 60% 10%', // Moved from 50% 0%
			'curve to 100% 100% with 70% 10%', // Control point moved from 60% 0%
			'line to 0% 100%',
			'curve to 60% 10% with 50% 10%' // Control point moved from 40% 0%
		]);
	});

	test('should show control points', async ({ page }) => {
		const tools = getTools(page);

		// First create a vertex with control points using the curve tool
		await tools.curve.click();
		const vertex = getVertices(page).first();
		await vertex.click();

		// Switch back to select tool
		await tools.select.click();

		// Should show control point handles
		const controlPoints = getControlPoints(page);
		await expect(controlPoints).toHaveCount(2);
		for (const controlPoint of await controlPoints.all()) {
			await expect(controlPoint).toBeVisible();
		}
	});

	test('should clear selection when clicking background', async ({ page }) => {
		const vertex = getVertices(page).first();

		// Select a vertex
		await vertex.click();
		await expect(vertex).toHaveAttribute('aria-pressed', 'true');

		// Click background (which should have an accessible name/role)
		const background = page.getByRole('button', { name: /clear selection/i });
		await background.click({
			// Ensure the clicked position is not covered by the foreground elements
			position: { x: 30, y: 30 }
		});

		// Vertex should no longer be selected
		await expect(vertex).toHaveAttribute('aria-pressed', 'false');
	});

	test('should clear selection when pressing Escape', async ({ page }) => {
		const vertex = getVertices(page).first();

		// Select a vertex
		await vertex.click();
		await expect(vertex).toHaveAttribute('aria-pressed', 'true');

		// Press Escape to clear selection
		await page.keyboard.press('Escape');
		await expect(vertex).toHaveAttribute('aria-pressed', 'false');
	});

	test('should switch selection when clicking different vertex', async ({ page }) => {
		const vertices = getVertices(page);
		const firstVertex = vertices.nth(0);
		const secondVertex = vertices.nth(1);

		// Select first vertex
		await firstVertex.click();
		await expect(firstVertex).toHaveAttribute('aria-pressed', 'true');
		await expect(secondVertex).toHaveAttribute('aria-pressed', 'false');

		// Select second vertex
		await secondVertex.click();
		await expect(firstVertex).toHaveAttribute('aria-pressed', 'false');
		await expect(secondVertex).toHaveAttribute('aria-pressed', 'true');
	});

	test('should add vertex to shape when clicking trigger', async ({ page }) => {
		// There should be a button to add a vertex to the shape on each midpoint
		// between two vertices. This one is between the vertices at (50% 0%) and
		// (100% 100%).
		const addVertexHandle = page.getByRole('button', { name: /^insert vertex at 75%, 50%/i });
		await addVertexHandle.click();

		const newVertex = page.getByRole('button', { name: /^vertex at 75%, 50%/i });

		await expect(newVertex).toBeVisible();
		await expect(newVertex).toHaveAttribute('aria-pressed', 'true');
	});
});
