import { describe, expect, it } from 'vitest';
import { Curve } from './Curve';
import { CoordinatePair } from '$lib/CoordinatePair';
import { px, raw } from '$lib/LengthPercentage';

describe('Curve', () => {
	describe('toCss', () => {
		it('should return single-line format for short coordinates', () => {
			const curve = new Curve(
				new CoordinatePair(px(10), px(20)),
				new CoordinatePair(px(5), px(15))
			);

			expect(curve.toCss('default')).toBe('curve to 10px 20px with 5px 15px');

			curve.method = 'by';

			expect(curve.toCss('default')).toBe('curve by 10px 20px with 5px 15px');
		});

		it('should include second control point when provided', () => {
			const curve = new Curve(
				new CoordinatePair(px(10), px(20)),
				new CoordinatePair(px(5), px(15)),
				new CoordinatePair(px(8), px(12))
			);

			expect(curve.toCss('default')).toBe('curve to 10px 20px with 5px 15px / 8px 12px');
		});

		it('should return multi-line format when one-liner exceeds 80 characters', () => {
			const to = new CoordinatePair(
				raw('calc(var(--radius) * cos(0.5turn))', px(0)),
				raw('calc(var(--radius) * sin(0.5turn))', px(0))
			);
			const control = new CoordinatePair(
				raw('calc(var(--radius) * cos(0.25turn))', px(0)),
				raw('calc(var(--radius) * sin(0.25turn))', px(0))
			);
			const curve = new Curve(to, control);

			expect(curve.toCss('default')).toBe(
				'curve to' +
					'\n\t\tcalc(var(--radius) * cos(0.5turn)) calc(var(--radius) * sin(0.5turn))' +
					'\n\t\twith calc(var(--radius) * cos(0.25turn)) calc(var(--radius) * sin(0.25turn))'
			);
		});

		it('should return multi-line format when one-liner exceeds 80 characters (two control points)', () => {
			const longX = raw('calc(100vw - 50px)', px(0));
			const longY = raw('calc(100vh - 30px)', px(0));
			const curve = new Curve(
				new CoordinatePair(longX, longY),
				new CoordinatePair(longX, longY),
				new CoordinatePair(longX, longY)
			);

			expect(curve.toCss('default')).toBe(
				'curve to' +
					'\n\t\tcalc(100vw - 50px) calc(100vh - 30px)' +
					'\n\t\twith calc(100vw - 50px) calc(100vh - 30px)' +
					'\n\t\t/ calc(100vw - 50px) calc(100vh - 30px)'
			);
		});

		it('should wrap x/y to separate lines when dimensions are very long', () => {
			const to = new CoordinatePair(
				raw('calc(var(--center-x) + var(--radius) * cos(1turn / var(--sides)))', px(0)),
				raw('calc(var(--center-y) + var(--radius) * sin(1turn / var(--sides)))', px(0))
			);
			const control = new CoordinatePair(
				raw('calc(var(--center-x) + var(--swell-radius) * cos(0.5turn / var(--sides)))', px(0)),
				raw('calc(var(--center-y) + var(--swell-radius) * sin(0.5turn / var(--sides)))', px(0))
			);
			const curve = new Curve(to, control);

			expect(curve.toCss('default')).toBe(
				'curve to' +
					'\n\t\tcalc(var(--center-x) + var(--radius) * cos(1turn / var(--sides)))' +
					'\n\t\tcalc(var(--center-y) + var(--radius) * sin(1turn / var(--sides)))' +
					'\n\t\twith' +
					'\n\t\t\tcalc(var(--center-x) + var(--swell-radius) * cos(0.5turn / var(--sides)))' +
					'\n\t\t\tcalc(var(--center-y) + var(--swell-radius) * sin(0.5turn / var(--sides)))'
			);
		});
	});
});
