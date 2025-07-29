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
import {
	testDeleteVertexWithDeleteKey,
	testDeleteVertexWithAltClick,
	testDeleteVertexWithFormButton
} from './editor-shared';

test.describe('Editor: Curve tool', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');

		// Activate curve tool
		await getTools(page).curve.check();
	});

	test('should create control points when vertex is clicked', async ({ page }) => {
		// Click on a vertex handle
		const vertex = getVertices(page).first();
		await vertex.click();

		// Should create visible control point handles
		const controlPoints = getControlPoints(page);
		await expect(controlPoints).toHaveCount(2);
		for (const controlPoint of await controlPoints.all()) {
			await expect(controlPoint).toBeVisible();
		}
	});

	test('should create control points by dragging from vertex', async ({ page }) => {
		// Get vertex button position
		const vertex = getVertices(page).first();
		const vertexPos = await getElementCenter(vertex);

		// Drag vertex to create control point
		await drag(page, vertexPos, translate(vertexPos, [50, -30]));

		// Should create visible control point handles
		const controlPoints = getControlPoints(page);
		await expect(controlPoints).toHaveCount(2);
		for (const controlPoint of await controlPoints.all()) {
			await expect(controlPoint).toBeVisible();
		}

		// Forward control point should follow the cursor
		const forward = getControlPoints(page, 'forward');
		const forwardPos = await getElementCenter(forward);
		await expect(forwardPos).toBeCloseVector(translate(vertexPos, [50, -30]));

		// Backward control point should be mirrored to the other side of the vertex
		const backward = getControlPoints(page, 'backward');
		const backwardPos = await getElementCenter(backward);
		await expect(backwardPos).toBeCloseVector(translate(vertexPos, [-50, 30]));
	});

	test('should generate curve commands in CSS output', async ({ page }) => {
		// Create a curve
		const vertex = getVertices(page).first();
		await vertex.click();

		// Check that CSS output contains curve commands
		const commands = await getOutputShapeCommands(page);
		expect(commands).toEqual([
			'from 50% 0%',
			'curve to 100% 100% with 60% 0%',
			'line to 0% 100%',
			'curve to 50% 0% with 40% 0%'
		]);
	});

	test('should select forward control point when clicked', async ({ page }) => {
		const vertex = getVertices(page).first();
		await vertex.click();

		const forward = getControlPoints(page, 'forward');
		await expect(forward).toHaveAttribute('aria-pressed', 'true');
	});

	test('should clear selection when clicking background', async ({ page }) => {
		// Select a vertex
		const vertex = getVertices(page).first();
		await vertex.click();

		const forward = getControlPoints(page, 'forward');
		await expect(forward).toHaveAttribute('aria-pressed', 'true');

		// Click background (which should have an accessible name/role)
		const background = page.getByRole('button', { name: /clear selection/i });
		await background.click({
			// Ensure the clicked position is not covered by the foreground elements
			position: { x: 30, y: 30 }
		});

		// Vertex should no longer be selected
		await expect(forward).toHaveAttribute('aria-pressed', 'false');
	});

	test('should clear selection when pressing Escape', async ({ page }) => {
		// Select a vertex
		const vertex = getVertices(page).first();
		await vertex.click();

		const forward = getControlPoints(page, 'forward');
		await expect(forward).toHaveAttribute('aria-pressed', 'true');

		// Press Escape to clear selection
		await page.keyboard.press('Escape');
		await expect(forward).toHaveAttribute('aria-pressed', 'false');
	});

	testDeleteVertexWithDeleteKey();
	testDeleteVertexWithAltClick();
	testDeleteVertexWithFormButton();
});
