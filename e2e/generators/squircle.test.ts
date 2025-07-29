import { getControlPoints, getOutputShapeCommands, getVertices } from '../helpers';
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

	test('can open in editor', async ({ page }) => {
		const editorButton = page.getByRole('button', { name: 'Open in editor' });
		await expect(editorButton).toBeVisible();
		await editorButton.click();

		await page.waitForURL('/editor');

		const vertices = getVertices(page);
		await expect(vertices).toHaveCount(4); // One on each side

		const controlPoints = getControlPoints(page);
		await expect(controlPoints).toHaveCount(8); // Two per vertex

		const [fromCommand, ...curveCommands] = await getOutputShapeCommands(page);
		expect(fromCommand).toMatch(/^from \d+% \d+%$/);
		for (const command of curveCommands) {
			expect(command).toMatch(/^curve to \d+% \d+% with \d+% \d+% \/ \d+% \d+%$/);
		}
	});
});
