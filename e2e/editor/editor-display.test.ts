import { getVertices } from '../helpers';
import { expect, test } from '../test-api';

test.describe('Editor display options', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');
	});

	test('can toggle vertex handles', async ({ page }) => {
		const vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);

		const displaySetting = page.getByLabel(/show handles/i);
		await expect(displaySetting).toBeChecked();

		await displaySetting.uncheck();
		await expect(displaySetting).not.toBeChecked();
		await expect(vertices).toHaveCount(0);

		await displaySetting.check();
		await expect(vertices).toHaveCount(3);
	});

	test('can toggle vertex handles with hotkey', async ({ page }) => {
		const vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);

		const displaySetting = page.getByLabel(/show handles/i);
		await expect(displaySetting).toBeChecked();

		// Wait for the checkbox to be enabled before trying the hotkey
		await expect(displaySetting).toBeEnabled();

		await page.keyboard.press('h');
		await expect(displaySetting).not.toBeChecked();
		await expect(displaySetting).toBeFocused();
		await expect(vertices).toHaveCount(0);

		await page.keyboard.press('h');
		await expect(displaySetting).toBeChecked();
		await expect(vertices).toHaveCount(3);
	});
});
