import { describe, expect, it } from 'vitest';
import { Curve } from './Curve';
import { Position } from '$lib/Position';
import { CoordinatePair } from '$lib/CoordinatePair';
import { px, raw } from '$lib/LengthPercentage';

describe('Curve', () => {
	describe('toString', () => {
		it('should return single-line format for short coordinates', () => {
			const curve = new Curve(new Position(px(10), px(20)), new Position(px(5), px(15)));

			expect(curve.toString()).toBe('curve to 10px 20px with 5px 15px');

			curve.method = 'by';

			expect(curve.toString()).toBe('curve by 10px 20px with 5px 15px');
		});

		it('should include second control point when provided', () => {
			const curve = new Curve(
				new Position(px(10), px(20)),
				new Position(px(5), px(15)),
				new Position(px(8), px(12))
			);

			expect(curve.toString()).toBe('curve to 10px 20px with 5px 15px / 8px 12px');
		});

		it('should return multi-line format when one-liner exceeds 80 characters', () => {
			const to = new CoordinatePair(
				raw('calc(var(--radius) * cos(0.5turn))'),
				raw('calc(var(--radius) * sin(0.5turn))')
			);
			const control = new CoordinatePair(
				raw('calc(var(--radius) * cos(0.25turn))'),
				raw('calc(var(--radius) * sin(0.25turn))')
			);
			const curve = new Curve(to, control);

			expect(curve.toString()).toBe(
				'curve to' +
					'\n\t\tcalc(var(--radius) * cos(0.5turn)) calc(var(--radius) * sin(0.5turn))' +
					'\n\t\twith calc(var(--radius) * cos(0.25turn)) calc(var(--radius) * sin(0.25turn))'
			);
		});

		it('should return multi-line format when one-liner exceeds 80 characters (two control points)', () => {
			const longX = raw('calc(100vw - 50px)');
			const longY = raw('calc(100vh - 30px)');
			const curve = new Curve(
				new Position(longX, longY),
				new Position(longX, longY),
				new Position(longX, longY)
			);

			expect(curve.toString()).toBe(
				'curve to' +
					'\n\t\tcalc(100vw - 50px) calc(100vh - 30px)' +
					'\n\t\twith calc(100vw - 50px) calc(100vh - 30px)' +
					'\n\t\t/ calc(100vw - 50px) calc(100vh - 30px)'
			);
		});

		it('should wrap x/y to separate lines when dimensions are very long', () => {
			const to = new CoordinatePair(
				raw('calc(var(--center-x) + var(--radius) * cos(1turn / var(--sides)))'),
				raw('calc(var(--center-y) + var(--radius) * sin(1turn / var(--sides)))')
			);
			const control = new CoordinatePair(
				raw('calc(var(--center-x) + var(--swell-radius) * cos(0.5turn / var(--sides)))'),
				raw('calc(var(--center-y) + var(--swell-radius) * sin(0.5turn / var(--sides)))')
			);
			const curve = new Curve(to, control);

			expect(curve.toString()).toBe(
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
