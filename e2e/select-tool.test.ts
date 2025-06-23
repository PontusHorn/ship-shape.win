import { expect, test } from '@playwright/test';
import { extractShapeCommands } from './helpers';

test.describe('Select Tool', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');
	});

	test('should select vertex when clicked', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.click();

		await expect(vertex).toHaveAttribute('aria-pressed', 'true');
	});

	test('should move vertex when dragged', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		const initialBox = await vertex.boundingBox();
		if (!initialBox) throw new Error('Could not get vertex bounding box');

		const centerX = initialBox.x + initialBox.width / 2;
		const centerY = initialBox.y + initialBox.height / 2;

		// Drag the vertex
		await page.mouse.move(centerX, centerY);
		await page.mouse.down();
		await page.mouse.move(centerX + 60, centerY + 30);
		await page.mouse.up();

		// Vertex should have moved
		const newBox = await vertex.boundingBox();
		if (!newBox) throw new Error('Could not get new vertex bounding box');

		const deltaX = newBox.x - initialBox.x;
		const deltaY = newBox.y - initialBox.y;
		expect(deltaX).toBeGreaterThan(59);
		expect(deltaX).toBeLessThan(61);
		expect(deltaY).toBeGreaterThan(29);
		expect(deltaY).toBeLessThan(31);

		// Output code should reflect the new position
		const output = page.locator('code');
		const commands = extractShapeCommands((await output.textContent()) ?? '');
		expect(commands).toEqual([
			'from 70% 10%', // Moved from 50% 0% (30px = 10% of 300px)
			'line to 100% 100%',
			'line to 0% 100%',
			'line to 70% 10%'
		]);
	});

	test('should move vertex with arrow keys', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.focus();

		const initialBox = await vertex.boundingBox();
		if (!initialBox) throw new Error('Could not get initial bounding box');

		// Use arrow keys to move the vertex
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowDown');

		// Vertex should have moved
		const newBox = await vertex.boundingBox();
		if (!newBox) throw new Error('Could not get new bounding box');

		expect(newBox.x).toBe(initialBox.x - 10);
		expect(newBox.y).toBe(initialBox.y + 10);

		// Output code should reflect the new position
		const output = page.locator('code');
		const commands = extractShapeCommands((await output.textContent()) ?? '');
		expect(commands).toEqual([
			'from 47% 3%', // Moved from 50% 0% (10px = 3% of 300px)
			'line to 100% 100%',
			'line to 0% 100%',
			'line to 47% 3%'
		]);
	});

	test('should support fine movement with Ctrl+arrow keys', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.focus();

		const initialBox = await vertex.boundingBox();
		if (!initialBox) throw new Error('Could not get initial bounding box');

		// Use Ctrl+arrow for fine movement
		await page.keyboard.press('Control+ArrowRight');

		const newBox = await vertex.boundingBox();
		if (!newBox) throw new Error('Could not get new bounding box');

		// Should move only a small amount (1px step)
		const deltaX = newBox.x - initialBox.x;
		expect(deltaX).toBe(1);
	});

	test('should support large movement with Shift+arrow keys', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.focus();

		const initialBox = await vertex.boundingBox();
		if (!initialBox) throw new Error('Could not get initial bounding box');

		// Use Shift+arrow for large movement
		await page.keyboard.press('Shift+ArrowRight');

		const newBox = await vertex.boundingBox();
		if (!newBox) throw new Error('Could not get new bounding box');

		// Should move a larger amount (30px step)
		const deltaX = newBox.x - initialBox.x;
		expect(deltaX).toBe(30);
	});

	test('should move control points along with vertex', async ({ page }) => {
		// Create a vertex with control points using the curve tool
		await page.getByRole('radio', { name: /curve/i }).click();
		let vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.click();

		// Switch back to select tool and focus the vertex
		await page.getByRole('radio', { name: /select/i }).click();
		vertex = page.getByRole('button', { name: /vertex at/i }).first();
		await vertex.focus();

		// Move the vertex with the arrow keys
		await page.keyboard.press('Shift+ArrowRight');
		await page.keyboard.press('Shift+ArrowDown');

		const output = page.locator('code');
		const commands = extractShapeCommands((await output.textContent()) ?? '');
		expect(commands).toEqual([
			'from 60% 10%', // Moved from 50% 0%
			'curve to 100% 100% with 70% 10%', // Control point moved from 60% 0%
			'line to 0% 100%',
			'curve to 60% 10% with 50% 10%' // Control point moved from 40% 0%
		]);
	});

	test('should clear selection when clicking background', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();

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
		await expect(vertex).not.toHaveAttribute('aria-pressed', 'true');
	});

	test('should clear selection when pressing Escape', async ({ page }) => {
		const vertex = page.getByRole('button', { name: /vertex at/i }).first();

		// Select a vertex
		await vertex.click();
		await expect(vertex).toHaveAttribute('aria-pressed', 'true');

		// Press Escape to clear selection
		await page.keyboard.press('Escape');
		await expect(vertex).not.toHaveAttribute('aria-pressed', 'true');
	});

	test('should switch selection when clicking different vertex', async ({ page }) => {
		const vertices = page.getByRole('button', { name: /vertex at/i });
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
