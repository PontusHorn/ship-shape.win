import { expect, test } from '@playwright/test';
import { getVertices } from './helpers';

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

		// Vertex should be deleted
		vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);

		const error = page.getByRole('alert');

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

		// Vertex should be deleted
		vertices = getVertices(page);
		await expect(vertices).toHaveCount(3);

		const error = page.getByRole('alert');

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
