import { describe, expect, it } from 'vitest';
import { Line } from './Line';
import { CoordinatePair } from '$lib/CoordinatePair';
import { px, raw } from '$lib/LengthPercentage';

describe('Line', () => {
	describe('toCss', () => {
		it('should return one-liner format for short coordinates with "to" method', () => {
			const line = new Line(new CoordinatePair(px(10), px(20)), 'to');

			expect(line.toCss('default')).toBe('line to 10px 20px');

			line.method = 'by';

			expect(line.toCss('default')).toBe('line by 10px 20px');
		});

		it('should return multi-line format when one-liner exceeds 80 characters', () => {
			// Create a long coordinate string using raw values
			const longX = raw('calc(100vw - 50px + 10em - 5rem + 20ch)', px(0));
			const longY = raw('calc(100vh - 30px + 15em - 8rem + 25ch)', px(0));
			const line = new Line(new CoordinatePair(longX, longY));

			expect(line.toCss('default')).toBe(
				'line to' +
					'\n\t\tcalc(100vw - 50px + 10em - 5rem + 20ch)' +
					'\n\t\tcalc(100vh - 30px + 15em - 8rem + 25ch)'
			);
		});
	});
});
