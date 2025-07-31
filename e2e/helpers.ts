import type { Locator, Page } from '@playwright/test';
import type { Vector } from '../src/lib/util/vector';

export async function getElementCenter(locator: Locator): Promise<Vector> {
	const boundingBox = await locator.boundingBox();
	if (!boundingBox) throw new Error('Failed to get bounding box');

	const centerX = boundingBox.x + boundingBox.width / 2;
	const centerY = boundingBox.y + boundingBox.height / 2;

	return [centerX, centerY];
}

/**
 * Like `getElementCenter`, but using the offset position rather than the
 * viewport-relative position, making it stable regardless of scrolling.
 */
export async function getElementOffsetCenter(locator: Locator): Promise<Vector> {
	const boundingBox = await locator.evaluate((element) => {
		if (!(element instanceof HTMLElement)) {
			throw new Error('Element must be an HTMLElement');
		}

		return {
			x: element.offsetLeft,
			y: element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight
		};
	});

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

export function getAddVertexButtons(page: Page) {
	return page.getByRole('button', { name: /^insert vertex at/i });
}

export async function getOutputShapeCommands(page: Page): Promise<string[]> {
	const output = getOutputCssElement(page);
	return extractShapeCommands((await output.textContent()) ?? '');
}

export function getOutputCssElement(page: Page): Locator {
	return page.getByTestId('css-output');
}

function extractShapeCommands(cssText: string): string[] {
	return (
		cssText
			// Trim everything except the contents of the shape() function
			.replace(/^.+: shape\(/s, '')
			.replace(/\);\s*$/, '')
			// Split into an array of individual commands
			.split(',')
			// Normalize whitespace for simpler, stabler assertions
			.map((s) => s.trim().replace(/\s+/g, ' '))
	);
}
