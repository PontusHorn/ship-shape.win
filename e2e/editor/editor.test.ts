import { expect, test } from '../test-api';

test.describe('Editor', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');
	});

	test('has title', async ({ page }) => {
		const title = await page.title();
		expect(title).toBe('Visual shape() editor - ship-shape.win');
	});

	test('renders valid HTML', async ({ page }) => {
		const content = await page.content();
		await expect(content).toBeValidHTML();
	});
});
