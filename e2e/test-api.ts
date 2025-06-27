import { expect as baseExpect } from '@playwright/test';
import { Vector } from './helpers';

export { test } from '@playwright/test';

export const expect = baseExpect.extend({
	async toBeCloseVector(
		actual: Vector,
		expected: Vector,
		{ maxDistance = 1 }: { maxDistance?: number } = {}
	) {
		const assertionName = 'toBeCloseVector';
		const { isNot } = this;
		const distance = calculateDistance(actual, expected);
		let pass = distance <= maxDistance;

		if (isNot) {
			pass = !pass;
		}

		const message = pass
			? () =>
					this.utils.matcherHint(assertionName, undefined, undefined, { isNot }) +
					'\n\n' +
					`Expected vector further than ${maxDistance}px from ${this.utils.printExpected(expected)}\n` +
					`Received: ${this.utils.printReceived(actual)}\n`
			: () =>
					this.utils.matcherHint(assertionName, undefined, undefined, { isNot }) +
					'\n\n' +
					`Expected vector within ${maxDistance}px from: ${this.utils.printExpected(expected)}\n` +
					`Received: ${this.utils.printReceived(actual)}\n`;

		return {
			message,
			pass,
			name: assertionName,
			expected,
			actual
		};
	}
});

function calculateDistance(a: Vector, b: Vector): number {
	return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}
