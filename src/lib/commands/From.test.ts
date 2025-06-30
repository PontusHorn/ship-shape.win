import { describe, expect, it } from 'vitest';
import { From } from './From';
import { Position } from '$lib/Position';
import { px, raw } from '$lib/LengthPercentage';

describe('From', () => {
	describe('toString', () => {
		it('should return single-line format for short coordinates', () => {
			const from = new From(new Position(px(10), px(20)));

			expect(from.toString()).toBe('from 10px 20px');
		});

		it('should return multi-line format when one-liner exceeds 80 characters', () => {
			const from = new From(
				new Position(
					raw('calc(var(--radius) * cos(0turn / var(--sides)))'),
					raw('calc(var(--radius) * sin(0turn / var(--sides)))')
				)
			);

			expect(from.toString()).toBe(
				'from' +
					'\n\t\tcalc(var(--radius) * cos(0turn / var(--sides)))' +
					'\n\t\tcalc(var(--radius) * sin(0turn / var(--sides)))'
			);
		});
	});
});
