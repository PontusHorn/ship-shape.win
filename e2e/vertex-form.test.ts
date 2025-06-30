import { expect, test } from './test-api';
import {
	getElementCenter,
	getOutputShapeCommands,
	getTools,
	getVertices,
	translate
} from './helpers';

test.describe('Editor: Vertex form', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/editor');

		// Make sure we're using the select tool
		const tools = getTools(page);
		await tools.select.click();
	});

	test('should show form when vertex is selected', async ({ page }) => {
		const vertex = getVertices(page).first();

		// Form should be empty initially
		await expect(page.getByLabel(/x:/i)).not.toBeVisible();
		await expect(page.getByLabel(/y:/i)).not.toBeVisible();

		// Select vertex
		await vertex.click();

		// Form should now show coordinate inputs
		await expect(page.getByLabel(/x:/i)).toBeVisible();
		await expect(page.getByLabel(/y:/i)).toBeVisible();

		// Deselect by clicking background
		const background = page.getByRole('button', { name: /clear selection/i });
		await background.click({ position: { x: 30, y: 30 } });

		// Form should be hidden again
		await expect(page.getByLabel(/x:/i)).not.toBeVisible();
		await expect(page.getByLabel(/y:/i)).not.toBeVisible();
	});

	test('should display current vertex coordinates', async ({ page }) => {
		const vertex = getVertices(page).first();
		await vertex.click();

		const xInput = page.getByLabel(/x:/i);
		const yInput = page.getByLabel(/y:/i);
		const xTypeSelect = page.getByLabel(/x type/i);
		const yTypeSelect = page.getByLabel(/y type/i);

		// Check initial values for the first vertex (should be 50% 0%)
		await expect(xInput).toHaveValue('50');
		await expect(xTypeSelect).toHaveValue('percent');
		await expect(yInput).toHaveValue('0');
		await expect(yTypeSelect).toHaveValue('percent');
	});

	test('should update vertex position when form values change', async ({ page }) => {
		const vertex = getVertices(page).first();
		const vertexPos = await getElementCenter(vertex);
		await vertex.click();

		const xInput = page.getByLabel(/x:/i);
		const yInput = page.getByLabel(/y:/i);

		// Change coordinates
		await xInput.fill('25');
		await yInput.fill('50');

		// Check that CSS output reflects the changes
		const commands = await getOutputShapeCommands(page);
		expect(commands[0]).toBe('from 25% 50%');

		// Visual position should also update
		const newVertexPos = await getElementCenter(vertex);
		// 25% of 300px = 75px, 50% of 300px = 150px
		expect(newVertexPos).toBeCloseVector(translate(vertexPos, [-75, 150]));
	});

	test('should convert coordinates when changing type', async ({ page }) => {
		const vertex = getVertices(page).last();
		await vertex.click();

		const xInput = page.getByLabel(/x:/i);
		const xTypeSelect = page.getByLabel(/x type/i);

		// Change to a percentage value that better verifies correct conversion
		await xInput.fill('25');
		const vertexPos = await getElementCenter(vertex);

		// Change type to px_from_start
		await xTypeSelect.selectOption('px_from_start');

		// Value should convert to equivalent pixels from start
		// 25% should equal 75px in a 300px container
		await expect(xInput).toHaveValue('75');
		expect(await getElementCenter(vertex)).toBeCloseVector(vertexPos);
		let commands = await getOutputShapeCommands(page);
		expect(commands[2]).toBe('line to 75px 0%');

		// Change to px_from_end
		await xTypeSelect.selectOption('px_from_end');

		// Value should convert: 300px - 75px = 225px from end
		await expect(xInput).toHaveValue('225');
		expect(await getElementCenter(vertex)).toBeCloseVector(vertexPos);
		commands = await getOutputShapeCommands(page);
		expect(commands[2]).toContain('line to calc(100% - 225px) 0%');

		// Back to percent
		await xTypeSelect.selectOption('percent');

		// Should be back to 25%
		await expect(xInput).toHaveValue('25');
		expect(await getElementCenter(vertex)).toBeCloseVector(vertexPos);
		commands = await getOutputShapeCommands(page);
		expect(commands[2]).toContain('line to 25% 0%');
	});

	test('should update form when different vertex is selected', async ({ page }) => {
		const vertices = getVertices(page);
		const firstVertex = vertices.nth(0);
		const secondVertex = vertices.nth(1);

		// Select first vertex
		await firstVertex.click();
		const xInput = page.getByLabel(/x:/i);
		await expect(xInput).toHaveValue('50'); // First vertex x coordinate

		// Select second vertex
		await secondVertex.click();
		await expect(xInput).toHaveValue('100'); // Second vertex x coordinate (100% 100%)
	});

	test('should support decimal values', async ({ page }) => {
		const vertex = getVertices(page).first();
		await vertex.click();

		const xInput = page.getByLabel(/x:/i);

		// Enter decimal value
		await xInput.fill('33.5');

		// Should accept and use the decimal value
		const commands = await getOutputShapeCommands(page);
		expect(commands[0]).toBe('from 34% 0%'); // Rounded to nearest integer
	});

	test('should validate input values', async ({ page }) => {
		const vertex = getVertices(page).first();
		await vertex.click();

		const xInput = page.getByLabel(/x:/i);

		// First, enter valid value to test fallback behavior
		await xInput.fill('75');

		// Try to enter invalid value
		await xInput.fill('invalid');

		// Should retain user input, but use the latest valid value for the output
		const value = await xInput.inputValue();
		expect(value).toBe('invalid');
		const commands = await getOutputShapeCommands(page);
		expect(commands[0]).toBe('from 75% 0%');

		// Should show error message
		await expect(page.getByText('Must be numeric')).toBeVisible();
	});
});
