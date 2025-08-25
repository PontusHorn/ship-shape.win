import { getVertices } from '../helpers';
import { expect, test } from '../test-api';

test.describe('Editor display options', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');
	});

	test('can toggle vertex handles off', async ({ page }) => {
		const vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);

		const displaySetting = page.getByLabel(/show handles/i);
		await expect(displaySetting).toBeChecked();

		await displaySetting.uncheck();
		await expect(displaySetting).not.toBeChecked();
		await expect(vertices).toHaveCount(0);
	});
});
