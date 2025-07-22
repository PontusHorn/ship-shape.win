import { describe, expect, it } from 'vitest';
import { lerp, distance, closestPointOnLine, type Vector } from './vector';

describe('lerp', () => {
	it('returns the endpoints at t=0 and t=1', () => {
		const a: Vector = [10, 20];
		const b: Vector = [30, 40];

		expect(lerp(a, b, 0)).toEqual([10, 20]);
		expect(lerp(a, b, 1)).toEqual([30, 40]);
	});

	it('returns the midpoint when t=0.5', () => {
		const a: Vector = [10, 20];
		const b: Vector = [30, 40];

		expect(lerp(a, b, 0.5)).toEqual([20, 30]);
	});

	it('interpolates correctly at arbitrary t values', () => {
		const a: Vector = [0, 0];
		const b: Vector = [100, 200];

		expect(lerp(a, b, 0.25)).toEqual([25, 50]);
		expect(lerp(a, b, 0.75)).toEqual([75, 150]);
	});

	it('handles negative coordinates', () => {
		const a: Vector = [-10, -20];
		const b: Vector = [10, 20];

		expect(lerp(a, b, 0.5)).toEqual([0, 0]);
	});
});

describe('distance', () => {
	it('should calculate distance between two points', () => {
		expect(distance([0, 0], [3, 4])).toBe(5);
		expect(distance([0, 0], [0, 0])).toBe(0);
		expect(distance([-1, -1], [1, 1])).toBeCloseTo(2.828, 2);
	});
});

describe('closestPointOnLine', () => {
	it('should find closest point on a horizontal line', () => {
		const result = closestPointOnLine([0, 0], [100, 0], [50, 25]);

		expect(result.point).toEqual([50, 0]);
		expect(result.t).toBe(0.5);
	});

	it('should clamp to line segment endpoints', () => {
		const lineStart: Vector = [0, 0];
		const lineEnd: Vector = [100, 0];

		// Point before start
		const result1 = closestPointOnLine(lineStart, lineEnd, [-50, 25]);
		expect(result1.point).toEqual([0, 0]);
		expect(result1.t).toBe(0);

		// Point after end
		const result2 = closestPointOnLine(lineStart, lineEnd, [150, 25]);
		expect(result2.point).toEqual([100, 0]);
		expect(result2.t).toBe(1);
	});

	it('should handle zero-length line', () => {
		const point: Vector = [50, 50];
		const result = closestPointOnLine(point, point, [100, 100]);

		expect(result.point).toEqual([50, 50]);
		expect(result.t).toBe(0);
	});

	it('should work with diagonal lines', () => {
		const result = closestPointOnLine([0, 0], [100, 100], [50, 0]);

		// Closest point on diagonal should be at (25, 25)
		expect(result.point[0]).toBeCloseTo(25, 1);
		expect(result.point[1]).toBeCloseTo(25, 1);
		expect(result.t).toBeCloseTo(0.25, 2);
	});
});
