import { expect, test } from '@playwright/test';
import { extractShapeCommands } from './helpers';

test.describe('Curve Editing Tool', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');

		// Activate curve tool
		await page.getByRole('radio', { name: /curve/i }).click();
	});

	test('should show control points when vertex is clicked in curve mode', async ({ page }) => {
		// Click on a vertex handle
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		await vertex.click();

		// Should show control point handles
		const controlPoints = page.getByRole('button', { name: /control point/i });
		await expect(controlPoints).toHaveCount(2); // forward and backward

		// Control points should be visible
		for (const controlPoint of await controlPoints.all()) {
			await expect(controlPoint).toBeVisible();
		}
	});

	test('should create control points by dragging from vertex in curve mode', async ({ page }) => {
		// Get vertex button position
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		const vertexBox = await vertex.boundingBox();
		const { x, y, width, height } = vertexBox!;
		const centerX = x + width / 2;
		const centerY = y + height / 2;

		// Drag from vertex center to create control point
		await page.mouse.move(centerX, centerY);
		await page.mouse.down();
		await page.mouse.move(centerX + 50, centerY - 30);
		await page.mouse.up();

		// Should show control point handles
		const controlPoints = page.getByRole('button', { name: /control point/i });
		await expect(controlPoints).toHaveCount(2);
	});

	test('should mirror control points by default', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		await vertex.click();

		// Get control point positions
		const controlPoints = page.getByRole('button', { name: /control point/i });
		const forwardControl = controlPoints.nth(0);
		const backwardControl = controlPoints.nth(1);

		const forwardBox = await forwardControl.boundingBox();
		const backwardBox = await backwardControl.boundingBox();
		if (!forwardBox || !backwardBox) throw new Error('Failed to get bounding boxes');

		// Drag forward control point
		const centerX = forwardBox.x + forwardBox.width / 2;
		const centerY = forwardBox.y + forwardBox.height / 2;

		await page.mouse.move(centerX, centerY);
		await page.mouse.down();
		await page.mouse.move(centerX + 30, centerY + 20);
		await page.mouse.up();

		// Backward control point should have moved in opposite direction
		const newBackwardBox = await backwardControl.boundingBox();
		if (!newBackwardBox) throw new Error('Failed to get bounding box');

		expect(newBackwardBox.x).toBe(backwardBox.x - 30);
		expect(newBackwardBox.y).toBe(backwardBox.y - 20);
	});

	test('should break mirroring when alt key is held', async ({ page }) => {
		// Create control points
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		await vertex.click();

		// Get control point positions
		const controlPoints = page.getByRole('button', { name: /control point/i });
		const forwardControl = controlPoints.nth(0);
		const backwardControl = controlPoints.nth(1);

		const forwardBox = await forwardControl.boundingBox();
		const backwardBox = await backwardControl.boundingBox();
		if (!forwardBox || !backwardBox) throw new Error('Failed to get bounding boxes');

		const centerX = forwardBox.x + forwardBox.width / 2;
		const centerY = forwardBox.y + forwardBox.height / 2;

		// Drag forward control point with Alt key
		await page.keyboard.down('Alt');
		await page.mouse.move(centerX, centerY);
		await page.mouse.down();
		await page.mouse.move(centerX + 30, centerY + 20);
		await page.mouse.up();
		await page.keyboard.up('Alt');

		// Backward control point should not have moved
		const newBackwardBox = await backwardControl.boundingBox();
		if (!newBackwardBox) throw new Error('Failed to get bounding box');

		expect(newBackwardBox.x).toBe(backwardBox.x);
		expect(newBackwardBox.y).toBe(backwardBox.y);
	});

	test('should generate curve commands in CSS output', async ({ page }) => {
		// Create a curve
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		await vertex.click();

		// Check that CSS output contains curve commands
		const output = page.locator('code');
		const commands = extractShapeCommands((await output.textContent()) ?? '');
		expect(commands).toEqual([
			'from 50% 0%',
			'curve to 100% 100% with 60% 0%',
			'line to 0% 100%',
			'curve to 50% 0% with 40% 0%'
		]);
	});

	test('should support keyboard navigation for control points', async ({ page }) => {
		// Create control points
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		await vertex.click();

		const controlPoints = page.getByRole('button', { name: /control point/i });
		const forwardControl = controlPoints.nth(0);
		const backwardControl = controlPoints.nth(1);

		// The first control point should be focused on creation
		await expect(forwardControl).toBeFocused();

		// Tab should move to second control point
		await page.keyboard.press('Tab');
		await expect(backwardControl).toBeFocused();
	});

	test('should move control points with arrow keys', async ({ page }) => {
		// Create control points
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		await vertex.click();

		const controlPoint = page.getByRole('button', { name: /control point/i }).first();

		// Focus control point and get initial position
		await controlPoint.focus();
		const initialBox = await controlPoint.boundingBox();

		// Use arrow keys to move
		await page.keyboard.press('ArrowRight');
		await page.keyboard.press('ArrowDown');

		// Position should have changed
		const newBox = await controlPoint.boundingBox();
		if (!initialBox || !newBox) throw new Error('Failed to get bounding boxes');

		expect(newBox.x).toBeGreaterThan(initialBox.x);
		expect(newBox.y).toBeGreaterThan(initialBox.y);
	});

	test('should select vertex when clicked', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();
		await expect(vertex).toHaveAttribute('aria-pressed', 'false');

		await vertex.click();
		await expect(vertex).toHaveAttribute('aria-pressed', 'true');
	});

	test('should clear selection when clicking background', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();

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
		const vertex = page.getByRole('button', { name: /^vertex at/i }).first();

		// Select a vertex
		await vertex.click();
		await expect(vertex).toHaveAttribute('aria-pressed', 'true');

		// Press Escape to clear selection
		await page.keyboard.press('Escape');
		await expect(vertex).toHaveAttribute('aria-pressed', 'false');
	});

	test('should switch selection when clicking different vertex', async ({ page }) => {
		const vertices = page.getByRole('button', { name: /^vertex at/i });
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
});
