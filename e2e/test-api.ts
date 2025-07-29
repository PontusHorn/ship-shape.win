import { expect as baseExpect } from '@playwright/test';
import type { Vector } from '../src/lib/util/vector';
import { HtmlValidate } from 'html-validate/browser';
import { formatterFactory } from 'html-validate';

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
	},

	async toBeValidHTML(content: string) {
		const assertionName = 'toBeValidHTML';
		const { isNot } = this;

		const htmlValidate = new HtmlValidate({
			// We don't use the "recommended" preset here since it includes a lot of
			// stylistic, opinionated rules, many of which are hard to satisfy in
			// SvelteKit. Instead, we use the "standard" preset to ensure compliance
			// with the WHATWG HTML standard, the "a11y" preset for more accessibility
			// checks, and the "document" preset to ensure the HTML represents a
			// whole, well-formed document.
			extends: ['html-validate:standard', 'html-validate:a11y', 'html-validate:document'],
			rules: {
				// SRI would be nice, but not sure we can add it in SvelteKit
				'require-sri': 'off'
			}
		});
		const report = await htmlValidate.validateString(content);
		let pass = report.valid;

		if (isNot) {
			pass = !pass;
		}

		const formatErrors = formatterFactory('stylish');
		const message = () =>
			this.utils.matcherHint(assertionName, undefined, undefined, { isNot }) +
			'\n\n' +
			`Expected HTML ${isNot ? 'not ' : ''}to pass validation.` +
			(isNot ? '' : ` Issues:\n` + formatErrors(report.results));

		return {
			message,
			pass,
			name: assertionName,
			actual: content
		};
	}
});

function calculateDistance(a: Vector, b: Vector): number {
	return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
}
