import { describe, expect, it } from 'vitest';
import { FromCommand } from './From';
import { px, raw } from '$lib/LengthPercentage';
import { CoordinatePair } from '$lib/CoordinatePair';

describe('From', () => {
	describe('toCss', () => {
		it('should return single-line format for short coordinates', () => {
			const from = new FromCommand(new CoordinatePair(px(10), px(20)));

			expect(from.toCss('default')).toBe('from 10px 20px');
		});

		it('should return multi-line format when one-liner exceeds 80 characters', () => {
			const from = new FromCommand(
				new CoordinatePair(
					raw('calc(var(--radius) * cos(0turn / var(--sides)))', px(0)),
					raw('calc(var(--radius) * sin(0turn / var(--sides)))', px(0))
				)
			);

			expect(from.toCss('default')).toBe(
				'from' +
					'\n\t\tcalc(var(--radius) * cos(0turn / var(--sides)))' +
					'\n\t\tcalc(var(--radius) * sin(0turn / var(--sides)))'
			);
		});
	});
});
