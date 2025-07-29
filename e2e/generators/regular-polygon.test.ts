import { expect, test } from '../test-api';

test.describe('Generators: Regular polygon', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/generators/regular-polygon');
	});

	test('has title', async ({ page }) => {
		const title = await page.title();
		expect(title).toBe('Regular polygon shape() generator - ship-shape.win');
	});

	test('renders valid HTML', async ({ page }) => {
		const content = await page.content();
		await expect(content).toBeValidHTML();
	});
});
