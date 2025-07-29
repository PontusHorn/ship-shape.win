import { expect, test } from '../test-api';

test.describe('Generators: Star', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/generators/star');
	});

	test('has title', async ({ page }) => {
		const title = await page.title();
		expect(title).toBe('Star shape() generator - ship-shape.win');
	});

	test('renders valid HTML', async ({ page }) => {
		const content = await page.content();
		await expect(content).toBeValidHTML();
	});
});
