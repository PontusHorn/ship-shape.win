import { expect, test } from '@playwright/test';

test.describe('Curve Editing Tool', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');

		// Activate curve tool
		await page.getByRole('radio', { name: /curve/i }).click();
	});

	test('should show control points when vertex is clicked in curve mode', async ({ page }) => {
		// Click on a vertex handle
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
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
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
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
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
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
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
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
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.click();

		// Check that CSS output contains curve command
		const output = page.locator('code');
		const cssText = await output.textContent();
		expect(cssText).toContain('curve');
	});

	test('should support keyboard navigation for control points', async ({ page }) => {
		// Create control points
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.click();

		const controlPoints = page.getByRole('button', { name: /control point/i });
		const forwardControl = controlPoints.nth(0);
		const backwardControl = controlPoints.nth(1);

		// Tab should move to first control point
		await page.keyboard.press('Tab');
		await expect(forwardControl).toBeFocused();

		// Tab again should move to second control point
		await page.keyboard.press('Tab');
		await expect(backwardControl).toBeFocused();
	});

	test('should move control points with arrow keys', async ({ page }) => {
		// Create control points
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
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

	test('should announce control point changes to screen readers', async ({ page }) => {
		// Create control points
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.click();

		// Move a control point
		const controlPoint = page.locator('[data-testid="control-point-forward"]').first();
		await controlPoint.focus();
		await page.keyboard.press('ArrowRight');

		// Should announce the new coordinates
		const liveRegion = page.locator('[aria-live="polite"]');
		await expect(liveRegion).toContainText(/\d+%, \d+%/i);
	});
});
