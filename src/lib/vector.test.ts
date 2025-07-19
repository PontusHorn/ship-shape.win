import { describe, expect, it } from 'vitest';
import { lerp, quadraticBezier, cubicBezier, type Vector } from './vector';

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

describe('quadraticBezier', () => {
	it('returns the endpoints at t=0 and t=1', () => {
		const from: Vector = [0, 0];
		const control: Vector = [50, 100];
		const control2: Vector = [100, 0];

		expect(quadraticBezier(from, control, control2, 0)).toEqual([0, 0]);
		expect(quadraticBezier(from, control, control2, 1)).toEqual([100, 0]);
	});

	it('calculates the midpoint correctly', () => {
		// Simple case: control point at the peak of a parabola
		const from: Vector = [0, 0];
		const control: Vector = [50, 100];
		const to: Vector = [100, 0];

		// At t=0.5, quadratic bezier should be at [50, 50]
		// This is because: (1-0.5)²*[0,0] + 2*(1-0.5)*0.5*[50,100] + 0.5²*[100,0]
		// = 0.25*[0,0] + 0.5*[50,100] + 0.25*[100,0]
		// = [0,0] + [25,50] + [25,0] = [50,50]
		expect(quadraticBezier(from, control, to, 0.5)).toEqual([50, 50]);
	});

	it('handles a straight line (control point on the line)', () => {
		const from: Vector = [0, 0];
		const control: Vector = [50, 50]; // On the line between from and to
		const to: Vector = [100, 100];

		// Should behave like linear interpolation
		expect(quadraticBezier(from, control, to, 0.5)).toEqual([50, 50]);
	});

	it('works with negative coordinates', () => {
		const from: Vector = [-100, -100];
		const control: Vector = [0, 100];
		const to: Vector = [100, -100];

		const result = quadraticBezier(from, control, to, 0.5);
		expect(result).toEqual([0, 0]);
	});

	it('calculates quarter points correctly', () => {
		const from: Vector = [0, 0];
		const control: Vector = [0, 100];
		const to: Vector = [100, 100];

		// At t=0.25: (0.75)²*[0,0] + 2*0.75*0.25*[0,100] + (0.25)²*[100,100]
		// = 0.5625*[0,0] + 0.375*[0,100] + 0.0625*[100,100]
		// = [0,0] + [0,37.5] + [6.25,6.25] = [6.25,43.75]
		expect(quadraticBezier(from, control, to, 0.25)).toEqual([6.25, 43.75]);
	});

	it('handles identical points', () => {
		const point: Vector = [50, 50];

		expect(quadraticBezier(point, point, point, 0.5)).toEqual([50, 50]);
	});
});

describe('cubicBezier', () => {
	it('returns the endpoints at t=0 and t=1', () => {
		const from: Vector = [0, 0];
		const control1: Vector = [33, 100];
		const control2: Vector = [67, 100];
		const to: Vector = [100, 0];

		expect(cubicBezier(from, control1, control2, to, 0)).toEqual([0, 0]);
		expect(cubicBezier(from, control1, control2, to, 1)).toEqual([100, 0]);
	});

	it('calculates the midpoint of a symmetric curve', () => {
		// Symmetric S-curve
		const from: Vector = [0, 0];
		const control1: Vector = [0, 100];
		const control2: Vector = [100, 0];
		const to: Vector = [100, 100];

		// At t=0.5, this should be at [50, 50] due to symmetry
		expect(cubicBezier(from, control1, control2, to, 0.5)).toEqual([50, 50]);
	});

	it('handles a straight line (all control points on the line)', () => {
		const from: Vector = [0, 0];
		const control1: Vector = [33, 33];
		const control2: Vector = [67, 67];
		const to: Vector = [100, 100];

		// Should behave like linear interpolation
		expect(cubicBezier(from, control1, control2, to, 0.5)).toEqual([50, 50]);
	});

	it('works with negative coordinates', () => {
		const from: Vector = [-100, 0];
		const control1: Vector = [-50, 100];
		const control2: Vector = [50, 100];
		const to: Vector = [100, 0];

		// At t=0.5, should be at [0, 75]
		// This is a symmetric curve, so x should be 0 at midpoint
		// y calculation: (1-0.5)³*0 + 3*(1-0.5)²*0.5*100 + 3*(1-0.5)*0.5²*100 + 0.5³*0
		// = 0 + 3*0.25*0.5*100 + 3*0.5*0.25*100 + 0
		// = 37.5 + 37.5 = 75
		expect(cubicBezier(from, control1, control2, to, 0.5)).toEqual([0, 75]);
	});

	it('calculates midpoint when control points are the same', () => {
		const from: Vector = [0, 0];
		const control1: Vector = [50, 100];
		const control2: Vector = [50, 100];
		const to: Vector = [100, 0];

		expect(cubicBezier(from, control1, control2, to, 0.5)).toEqual([50, 75]);
	});

	it('calculates quarter points correctly', () => {
		const from: Vector = [0, 0];
		const control1: Vector = [0, 100];
		const control2: Vector = [100, 100];
		const to: Vector = [100, 0];

		const result = cubicBezier(from, control1, control2, to, 0.25);

		// At t=0.25: (0.75)³*[0,0] + 3*(0.75)²*0.25*[0,100] + 3*0.75*(0.25)²*[100,100] + (0.25)³*[100,0]
		// = 0.421875*[0,0] + 0.421875*[0,100] + 0.140625*[100,100] + 0.015625*[100,0]
		// = [0,0] + [0,42.1875] + [14.0625,14.0625] + [1.5625,0]
		// = [15.625, 56.25]
		expect(result[0]).toBeCloseTo(15.625, 10);
		expect(result[1]).toBeCloseTo(56.25, 10);
	});

	it('handless identical points', () => {
		const point: Vector = [50, 50];

		expect(cubicBezier(point, point, point, point, 0.5)).toEqual([50, 50]);
	});
});
