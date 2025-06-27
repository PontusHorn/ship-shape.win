import { expect, test } from './test-api';
import {
	drag,
	getControlPoints,
	getElementCenter,
	getOutputShapeCommands,
	getTools,
	getVertices,
	translate
} from './helpers';

// These tests are mostly expected to work the same in both the Select and Curve tools,
// so most of them loop over the tools and reruns its tests on each.

test.describe('Editor: Control points', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');

		// Create control points for the first vertex using the curve tool
		await getTools(page).curve.click();
		await getVertices(page).first().click();
	});

	test('should move control point when dragging', async ({ page }) => {
		const tools = getTools(page);
		for (const tool of [tools.select, tools.curve]) {
			await tool.click();

			const controlPoint = getControlPoints(page).first();
			const initialPos = await getElementCenter(controlPoint);

			// Drag control point
			await drag(page, initialPos, translate(initialPos, [30, 30]));

			// Control point should have moved
			const newPos = await getElementCenter(controlPoint);
			expect(newPos).toBeCloseVector(translate(initialPos, [30, 30]));
		}

		// Output code should reflect the control point moving from 60% 0% to 80% 20%
		// (moved 30px twice = 20% of 300px)
		const commands = await getOutputShapeCommands(page);
		expect(commands).toContainEqual('curve to 100% 100% with 80% 20%');
	});

	test('should mirror control points when dragging', async ({ page }) => {
		const tools = getTools(page);
		for (const tool of [tools.select, tools.curve]) {
			await tool.click();

			const forward = getControlPoints(page, 'forward');
			const backward = getControlPoints(page, 'backward');
			const forwardPos = await getElementCenter(forward);
			const backwardPos = await getElementCenter(backward);

			// Drag forward control point
			const targetForwardPos = translate(forwardPos, [30, 20]);
			await drag(page, forwardPos, targetForwardPos);

			// Backward control point should have moved in opposite direction
			const newBackwardPos = await getElementCenter(backward);
			expect(newBackwardPos).toBeCloseVector(translate(backwardPos, [-30, -20]));

			// Drag backward control point
			await drag(page, newBackwardPos, translate(newBackwardPos, [-20, -60]));

			// Forward control point should have moved in opposite direction
			const newForwardPos = await getElementCenter(forward);
			expect(newForwardPos).toBeCloseVector(translate(targetForwardPos, [20, 60]));
		}
	});

	test('should break mirroring when alt key is held', async ({ page }) => {
		const tools = getTools(page);
		for (const tool of [tools.select, tools.curve]) {
			await tool.click();

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
			expect(newBackwardPos).toBeCloseVector(backwardPos);

			// Drag again without Alt now that mirroring is disabled
			await drag(page, targetPos, translate(targetPos, [100, 0]));

			// Backward control point should still not have moved
			newBackwardPos = await getElementCenter(backward);
			expect(newBackwardPos).toBeCloseVector(backwardPos);
		}
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
		for (const tool of [tools.select, tools.curve]) {
			await tool.click();

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
		}
	});
});
