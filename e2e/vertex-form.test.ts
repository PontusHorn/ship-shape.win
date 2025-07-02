import { expect, test } from './test-api';
import {
	getElementCenter,
	getOutputShapeCommands,
	getTools,
	getVertices,
	getControlPoints
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

		// Deselect by pressing escape
		await page.keyboard.press('Escape');

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
		expect(newVertexPos[0]).toBeLessThan(vertexPos[0]);
		expect(newVertexPos[1]).toBeGreaterThan(vertexPos[1]);
	});

	test('should convert coordinates when changing type', async ({ page }) => {
		const vertex = getVertices(page).first();
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
		expect(commands[0]).toBe('from 75px 0%');

		// Change to px_from_end
		await xTypeSelect.selectOption('px_from_end');

		// Value should convert: 300px - 75px = 225px from end
		await expect(xInput).toHaveValue('225');
		expect(await getElementCenter(vertex)).toBeCloseVector(vertexPos);
		commands = await getOutputShapeCommands(page);
		expect(commands[0]).toBe('from calc(100% - 225px) 0%');

		// Back to percent
		await xTypeSelect.selectOption('percent');

		// Should be back to 25%
		await expect(xInput).toHaveValue('25');
		expect(await getElementCenter(vertex)).toBeCloseVector(vertexPos);
		commands = await getOutputShapeCommands(page);
		expect(commands[0]).toBe('from 25% 0%');
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

	test('moves control points along with vertex', async ({ page }) => {
		const tools = getTools(page);

		// Create control points using the curve tool
		await tools.curve.click();
		const vertex = getVertices(page).first();
		await vertex.click();

		// Switch back to select tool
		await tools.select.click();
		await vertex.click();

		const xInput = page.getByLabel(/x:/i);
		const yInput = page.getByLabel(/y:/i);

		// Change vertex coordinates
		await xInput.fill('25');
		await yInput.fill('25');

		// Check that control points moved along with the vertex
		const commands = await getOutputShapeCommands(page);
		expect(commands).toEqual([
			'from 25% 25%',
			'curve to 100% 100% with 35% 25%', // Control point moved from 60% 0% to 35% 25%
			'line to 0% 100%',
			'curve to 25% 25% with 15% 25%' // Control point moved from 40% 0% to 15% 25%
		]);
	});

	test('shows form when control point is selected', async ({ page }) => {
		const tools = getTools(page);

		// Create control points using the curve tool
		await tools.curve.click();
		const vertex = getVertices(page).first();
		await vertex.click();

		// Switch back to select tool
		await tools.select.click();

		// Deselect by pressing escape
		await page.keyboard.press('Escape');

		// Form should be empty initially
		await expect(page.getByLabel(/x:/i)).not.toBeVisible();
		await expect(page.getByLabel(/y:/i)).not.toBeVisible();

		// Select forward control point
		const forwardControlPoint = getControlPoints(page, 'forward');
		await forwardControlPoint.click();

		// Form should now show coordinate inputs
		await expect(page.getByLabel(/x:/i)).toBeVisible();
		await expect(page.getByLabel(/y:/i)).toBeVisible();
	});

	test('displays current control point coordinates', async ({ page }) => {
		const tools = getTools(page);

		// Create control points using the curve tool
		await tools.curve.click();
		const vertex = getVertices(page).first();
		await vertex.click();

		// Switch back to select tool
		await tools.select.click();

		// Select forward control point
		const forwardControlPoint = getControlPoints(page, 'forward');
		await forwardControlPoint.click();

		const xInput = page.getByLabel(/x:/i);
		const yInput = page.getByLabel(/y:/i);
		const xTypeSelect = page.getByLabel(/x type/i);
		const yTypeSelect = page.getByLabel(/y type/i);

		// Check initial values for the forward control point (should be 60% 0%)
		await expect(xInput).toHaveValue('60');
		await expect(xTypeSelect).toHaveValue('percent');
		await expect(yInput).toHaveValue('0');
		await expect(yTypeSelect).toHaveValue('percent');
	});

	test('updates control point position when form values change', async ({ page }) => {
		const tools = getTools(page);

		// Create control points using the curve tool
		await tools.curve.click();
		const vertex = getVertices(page).first();
		await vertex.click();

		// Switch back to select tool
		await tools.select.click();

		// Select forward control point
		const forwardControlPoint = getControlPoints(page, 'forward');
		const controlPointPos = await getElementCenter(forwardControlPoint);
		await forwardControlPoint.click();

		const xInput = page.getByLabel(/x:/i);
		const yInput = page.getByLabel(/y:/i);

		// Change control point coordinates
		await xInput.fill('75');
		await yInput.fill('15');

		// Check that CSS output reflects the changes
		const commands = await getOutputShapeCommands(page);
		expect(commands).toContainEqual('curve to 100% 100% with 75% 15%');

		// Visual position should also update
		const newControlPointPos = await getElementCenter(forwardControlPoint);
		expect(newControlPointPos[0]).toBeGreaterThan(controlPointPos[0]);
		expect(newControlPointPos[1]).toBeGreaterThan(controlPointPos[1]);
	});

	test('mirrors control point position', async ({ page }) => {
		const tools = getTools(page);

		// Create control points using the curve tool
		await tools.curve.click();
		const vertex = getVertices(page).first();
		await vertex.click();

		// Switch back to select tool
		await tools.select.click();

		// Select forward control point and change its position
		const forwardControlPoint = getControlPoints(page, 'forward');
		await forwardControlPoint.click();

		const xInput = page.getByLabel(/x:/i);
		const yInput = page.getByLabel(/y:/i);

		// Change forward control point coordinates
		await xInput.fill('70');
		await yInput.fill('20');

		// Select backward control point to check if it mirrored
		const backwardControlPoint = getControlPoints(page, 'backward');
		await backwardControlPoint.click();

		// Backward control point should have mirrored position (30% -20% relative to vertex at 50% 0%)
		await expect(xInput).toHaveValue('30');
		await expect(yInput).toHaveValue('-20');

		// Check CSS output shows mirrored positions
		const commands = await getOutputShapeCommands(page);
		expect(commands).toEqual([
			'from 50% 0%',
			'curve to 100% 100% with 70% 20%',
			'line to 0% 100%',
			'curve to 50% 0% with 30% -20%'
		]);
	});
});
