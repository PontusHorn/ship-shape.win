import { expect, test } from '@playwright/test';
import { getVertices } from '../helpers';

export function testDeleteVertexWithDeleteKey() {
	test('should handle vertex deletion with Delete key', async ({ page }) => {
		// First add a vertex so we have more than 3 to test deletion
		const addVertexHandle = page.getByRole('button', { name: /^insert vertex at 75%, 50%/i });
		await addVertexHandle.click();

		let vertices = getVertices(page);
		await expect(vertices).toHaveCount(4);

		// Delete vertex with Delete key when vertex is focused
		const targetVertex = vertices.nth(0);
		await targetVertex.focus();

		await page.keyboard.press('Delete');

		const error = page.getByRole('alert');

		// Vertex should be deleted with no error
		vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);
		await expect(error).not.toBeVisible();

		// Try to delete when no vertex focused (should do nothing)
		await page.keyboard.press('Delete');

		// Should still have 3 vertices
		vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);
		await expect(error).not.toBeVisible();

		// Try to delete when only 3 vertices remain (should fail gracefully with an
		// error message)
		const firstVertex = vertices.nth(0);
		await firstVertex.focus();
		await page.keyboard.press('Delete');

		// Should still have 3 vertices and show error
		await expect(getVertices(page)).toHaveCount(3);
		await expect(error).toBeVisible();
		await expect(error).toContainText("Can't delete. The shape must have at least 3 vertices.");
	});
}

export function testDeleteVertexWithAltClick() {
	test('should handle vertex deletion with Alt+click', async ({ page }) => {
		// First add a vertex so we have more than 3 to test deletion
		const addVertexHandle = page.getByRole('button', { name: /^insert vertex at 75%, 50%/i });
		await addVertexHandle.click();

		let vertices = getVertices(page);
		await expect(vertices).toHaveCount(4);

		// Delete vertex with Alt+click
		const targetVertex = vertices.nth(0);
		await targetVertex.click({ modifiers: ['Alt'] });

		const error = page.getByRole('alert');
		await expect(error).not.toBeVisible();

		// Vertex should be deleted with no error
		vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);
		await expect(error).not.toBeVisible();

		// Try to delete when only 3 vertices remain (should fail gracefully with an
		// error message)
		const firstVertex = vertices.nth(0);
		await firstVertex.click({ modifiers: ['Alt'] });

		// Should still have 3 vertices and show error
		await expect(getVertices(page)).toHaveCount(3);
		await expect(error).toBeVisible();
		await expect(error).toContainText("Can't delete. The shape must have at least 3 vertices.");

		// Dismiss error
		await page.keyboard.press('Escape');
		await expect(error).not.toBeVisible();

		// Regular click without Alt should not delete
		const secondVertex = vertices.nth(1);
		await secondVertex.click();

		// Should still have 3 vertices and no error
		await expect(getVertices(page)).toHaveCount(3);
		await expect(error).not.toBeVisible();
	});
}

export function testDeleteVertexWithFormButton() {
	test('should handle vertex deletion with form delete button', async ({ page }) => {
		// First add a vertex so we have more than 3 to test deletion
		const addVertexHandle = page.getByRole('button', { name: /^insert vertex at 75%, 50%/i });
		await addVertexHandle.click();

		let vertices = getVertices(page);
		await expect(vertices).toHaveCount(4);

		// Select a vertex to show the form. Click it twice, since in the Curve tool
		// the first click will create control points and select one of those.
		const targetVertex = vertices.nth(0);
		await targetVertex.click();
		await targetVertex.click();

		// Delete button should be visible and enabled
		const deleteButton = page.getByRole('button', { name: /delete vertex/i });
		await expect(deleteButton).toBeVisible();

		// Delete vertex via form button
		await deleteButton.click();

		const error = page.getByRole('alert');

		// Vertex should be deleted with no error
		vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);
		await expect(error).not.toBeVisible();

		// Try to delete another vertex to test error state
		const firstVertex = vertices.nth(0);
		await firstVertex.click();
		await firstVertex.click();
		await deleteButton.click();

		// Should still have 3 vertices and show error
		await expect(getVertices(page)).toHaveCount(3);
		await expect(error).toBeVisible();
		await expect(error).toContainText("Can't delete. The shape must have at least 3 vertices.");

		// Dismiss error and clear selection: button should not be visible
		await page.keyboard.press('Escape');
		await page.keyboard.press('Escape');
		await expect(deleteButton).not.toBeVisible();
	});
}
