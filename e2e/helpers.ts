import { Locator, Page } from '@playwright/test';
import type { Vector } from '../src/lib/vector';

export async function getElementCenter(locator: Locator): Promise<Vector> {
	const boundingBox = await locator.boundingBox();
	if (!boundingBox) throw new Error('Failed to get bounding box');

	const centerX = boundingBox.x + boundingBox.width / 2;
	const centerY = boundingBox.y + boundingBox.height / 2;

	return [centerX, centerY];
}

export async function drag(page: Page, from: Vector, to: Vector) {
	await page.mouse.move(...from);
	await page.mouse.down();
	await page.mouse.move(...to);
	await page.mouse.up();
}

export function getTools(page: Page) {
	return {
		select: page.getByRole('radio', { name: /^select$/i }),
		curve: page.getByRole('radio', { name: /^curve$/i })
	};
}

export function getVertices(page: Page) {
	return page.getByRole('button', { name: /^vertex at/i });
}

export function getControlPoints(page: Page, direction?: 'forward' | 'backward') {
	switch (direction) {
		case 'forward':
			return page.getByRole('button', { name: /^forward control point/i });
		case 'backward':
			return page.getByRole('button', { name: /^backward control point/i });
		default:
			return page.getByRole('button', { name: /^(forward|backward) control point/i });
	}
}

export async function getOutputShapeCommands(page: Page): Promise<string[]> {
	const output = page.getByTestId('css-output');
	return extractShapeCommands((await output.textContent()) ?? '');
}

function extractShapeCommands(cssText: string): string[] {
	return (
		cssText
			// Trim everything except the contents of the shape() function
			.replace(/^.+: shape\(/, '')
			.replace(/\);\s*$/, '')
			// Split into an array of individual commands
			.split(',')
			// Normalize whitespace for simpler, stabler assertions
			.map((s) => s.trim().replace(/\s+/g, ' '))
	);
}
