import { expect, test } from '../test-api';

test.describe('Generators: Squircle', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/generators/squircle');
	});

	test('has title', async ({ page }) => {
		const title = await page.title();
		expect(title).toBe('Squircle shape() generator - ship-shape.win');
	});

	test('renders valid HTML', async ({ page }) => {
		const content = await page.content();
		await expect(content).toBeValidHTML();
	});
});
