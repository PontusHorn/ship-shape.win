import { getVertices, getControlPoints, getOutputShapeCommands } from '../helpers';
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

	test('can open in editor', async ({ page }) => {
		const editorButton = page.getByRole('button', { name: 'Open in editor' });
		await expect(editorButton).toBeVisible();
		await editorButton.click();

		await page.waitForURL('/editor');

		const vertices = getVertices(page);
		await expect(vertices).toHaveCount(6); // 6 corners

		const controlPoints = getControlPoints(page);
		await expect(controlPoints).toHaveCount(0); // Only straight lines

		const [fromCommand, ...lineCommands] = await getOutputShapeCommands(page);
		expect(fromCommand).toMatch(/^from \d+% \d+%$/);
		for (const command of lineCommands) {
			expect(command).toMatch(/^line to \d+% \d+%$/);
		}
	});
});
