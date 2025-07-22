import { describe, expect, it } from 'vitest';
import {
	closestPointOnQuadraticBezier,
	closestPointOnCubicBezier,
	interpolateQuadraticBezier,
	makeQuadraticBezier,
	makeCubicBezier,
	interpolateCubicBezier
} from './curve';
import type { Vector } from './vector';

describe('interpolateQuadraticBezier', () => {
	it('returns the endpoints at t=0 and t=1', () => {
		const curve = makeQuadraticBezier([0, 0], [50, 100], [100, 0]);

		expect(interpolateQuadraticBezier(curve, 0)).toEqual([0, 0]);
		expect(interpolateQuadraticBezier(curve, 1)).toEqual([100, 0]);
	});

	it('calculates the midpoint correctly', () => {
		// Simple case: control point at the peak of a parabola
		const curve = makeQuadraticBezier([0, 0], [50, 100], [100, 0]);

		// At t=0.5, quadratic bezier should be at [50, 50]
		// This is because: (1-0.5)²*[0,0] + 2*(1-0.5)*0.5*[50,100] + 0.5²*[100,0]
		// = 0.25*[0,0] + 0.5*[50,100] + 0.25*[100,0]
		// = [0,0] + [25,50] + [25,0] = [50,50]
		expect(interpolateQuadraticBezier(curve, 0.5)).toEqual([50, 50]);
	});

	it('handles a straight line (control point on the line)', () => {
		const curve = makeQuadraticBezier(
			[0, 0],
			[50, 50], // On the line between from and to
			[100, 100]
		);

		// Should behave like linear interpolation
		expect(interpolateQuadraticBezier(curve, 0.5)).toEqual([50, 50]);
	});

	it('works with negative coordinates', () => {
		const curve = makeQuadraticBezier([-100, -100], [0, 100], [100, -100]);

		const result = interpolateQuadraticBezier(curve, 0.5);
		expect(result).toEqual([0, 0]);
	});

	it('calculates quarter points correctly', () => {
		const curve = makeQuadraticBezier([0, 0], [0, 100], [100, 100]);

		// At t=0.25: (0.75)²*[0,0] + 2*0.75*0.25*[0,100] + (0.25)²*[100,100]
		// = 0.5625*[0,0] + 0.375*[0,100] + 0.0625*[100,100]
		// = [0,0] + [0,37.5] + [6.25,6.25] = [6.25,43.75]
		expect(interpolateQuadraticBezier(curve, 0.25)).toEqual([6.25, 43.75]);
	});

	it('handles identical points', () => {
		const curve = makeQuadraticBezier([50, 50], [50, 50], [50, 50]);

		expect(interpolateQuadraticBezier(curve, 0.5)).toEqual([50, 50]);
	});
});

describe('interpolateCubicBezier', () => {
	it('returns the endpoints at t=0 and t=1', () => {
		const curve = makeCubicBezier([0, 0], [33, 100], [67, 100], [100, 0]);

		expect(interpolateCubicBezier(curve, 0)).toEqual([0, 0]);
		expect(interpolateCubicBezier(curve, 1)).toEqual([100, 0]);
	});

	it('calculates the midpoint of a symmetric curve', () => {
		// Symmetric S-curve
		const curve = makeCubicBezier([0, 0], [0, 100], [100, 0], [100, 100]);

		// At t=0.5, this should be at [50, 50] due to symmetry
		expect(interpolateCubicBezier(curve, 0.5)).toEqual([50, 50]);
	});

	it('handles a straight line (all control points on the line)', () => {
		const curve = makeCubicBezier([0, 0], [33, 33], [67, 67], [100, 100]);

		// Should behave like linear interpolation
		expect(interpolateCubicBezier(curve, 0.5)).toEqual([50, 50]);
	});

	it('works with negative coordinates', () => {
		const curve = makeCubicBezier([-100, 0], [-50, 100], [50, 100], [100, 0]);

		// At t=0.5, should be at [0, 75]
		// This is a symmetric curve, so x should be 0 at midpoint
		// y calculation: (1-0.5)³*0 + 3*(1-0.5)²*0.5*100 + 3*(1-0.5)*0.5²*100 + 0.5³*0
		// = 0 + 3*0.25*0.5*100 + 3*0.5*0.25*100 + 0
		// = 37.5 + 37.5 = 75
		expect(interpolateCubicBezier(curve, 0.5)).toEqual([0, 75]);
	});

	it('calculates midpoint when control points are the same', () => {
		const curve = makeCubicBezier([0, 0], [50, 100], [50, 100], [100, 0]);

		expect(interpolateCubicBezier(curve, 0.5)).toEqual([50, 75]);
	});

	it('calculates quarter points correctly', () => {
		const curve = makeCubicBezier([0, 0], [0, 100], [100, 100], [100, 0]);

		const result = interpolateCubicBezier(curve, 0.25);

		// At t=0.25: (0.75)³*[0,0] + 3*(0.75)²*0.25*[0,100] + 3*0.75*(0.25)²*[100,100] + (0.25)³*[100,0]
		// = 0.421875*[0,0] + 0.421875*[0,100] + 0.140625*[100,100] + 0.015625*[100,0]
		// = [0,0] + [0,42.1875] + [14.0625,14.0625] + [1.5625,0]
		// = [15.625, 56.25]
		expect(result[0]).toBeCloseTo(15.625, 10);
		expect(result[1]).toBeCloseTo(56.25, 10);
	});

	it('handles identical points', () => {
		const curve = makeCubicBezier([50, 50], [50, 50], [50, 50], [50, 50]);

		expect(interpolateCubicBezier(curve, 0.5)).toEqual([50, 50]);
	});
});

describe('closestPointOnQuadraticBezier', () => {
	it('should find closest point on a simple quadratic curve', () => {
		const curve = makeQuadraticBezier([0, 100], [50, 0], [100, 100]);
		const point: Vector = [50, 50];

		const result = closestPointOnQuadraticBezier(curve, point);

		expect(result.t).toBe(0.5);
		expect(result.point[0]).toBeCloseTo(50, 10);
	});

	it('should return start point when query point is closest to start', () => {
		const curve = makeQuadraticBezier([0, 0], [50, 50], [100, 0]);
		const point: Vector = [-10, 0]; // Close to start

		const result = closestPointOnQuadraticBezier(curve, point);

		expect(result.t).toBe(0);
		expect(result.point[0]).toBeCloseTo(0, 5);
		expect(result.point[1]).toBeCloseTo(0, 5);
	});

	it('should return end point when query point is closest to end', () => {
		const curve = makeQuadraticBezier([0, 0], [50, 50], [100, 0]);
		const point: Vector = [110, 0]; // Very close to end

		const result = closestPointOnQuadraticBezier(curve, point);

		expect(result.t).toBe(1);
		expect(result.point[0]).toBeCloseTo(100, 5);
		expect(result.point[1]).toBeCloseTo(0, 5);
	});
});

describe('closestPointOnCubicBezier', () => {
	it('should find closest point on a cubic curve', () => {
		const curve = makeCubicBezier([0, 50], [0, 0], [100, 0], [100, 50]);
		const point: Vector = [50, 25];

		const result = closestPointOnCubicBezier(curve, point);

		// Should find a reasonable point along the curve
		expect(result.t).toBeGreaterThan(0);
		expect(result.t).toBeLessThan(1);
		expect(result.point[0]).toBeCloseTo(50, 15);
	});

	it('should work with S-curve', () => {
		const curve = makeCubicBezier([0, 0], [0, 100], [100, 0], [100, 100]);
		const point: Vector = [50, 50];

		const result = closestPointOnCubicBezier(curve, point);

		// For this symmetric S-curve, closest to center should be near t=0.5
		expect(result.t).toBeCloseTo(0.5, 0.3);
		expect(result.point[0]).toBeCloseTo(50, 10);
		expect(result.point[1]).toBeCloseTo(50, 10);
	});

	it('should handle degenerate cubic (all points the same)', () => {
		const curve = makeCubicBezier([50, 50], [50, 50], [50, 50], [50, 50]);
		const point: Vector = [60, 60];

		const result = closestPointOnCubicBezier(curve, point);

		expect(result.point).toEqual([50, 50]);
		expect(result.t).toBe(0);
	});
});
