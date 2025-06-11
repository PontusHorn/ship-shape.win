import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
	await page.goto('/');
	const title = await page.title();
	expect(title).toBe('ship-shape.win');
});
