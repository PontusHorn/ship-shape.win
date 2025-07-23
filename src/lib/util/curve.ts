import { assertNever } from './assert';
import type { Command } from '../commands/Command';
import { CurveCommand } from '../commands/Curve';
import { LineCommand } from '../commands/Line';
import { CoordinatePair } from '../CoordinatePair';
import { clamp } from './math';
import { closestPointOnLine, distance, lerp, type Vector } from './vector';

export type Curve = Line | QuadraticBezier | CubicBezier;

export type Line = {
	type: 'line';
	from: Vector;
	to: Vector;
};

export type QuadraticBezier = {
	type: 'quadraticBezier';
	from: Vector;
	control: Vector;
	to: Vector;
};

export type CubicBezier = {
	type: 'cubicBezier';
	from: Vector;
	control1: Vector;
	control2: Vector;
	to: Vector;
};

export function makeLine(from: Vector, to: Vector): Line {
	return { type: 'line', from, to };
}

export function makeQuadraticBezier(from: Vector, control: Vector, to: Vector): QuadraticBezier {
	return { type: 'quadraticBezier', from, to, control };
}

export function makeCubicBezier(
	from: Vector,
	control1: Vector,
	control2: Vector,
	to: Vector
): CubicBezier {
	return { type: 'cubicBezier', from, to, control1, control2 };
}

export function makeCurve(from: Vector, to: Vector, control1?: Vector, control2?: Vector): Curve {
	const control = control1 || control2;

	if (control1 && control2) {
		return makeCubicBezier(from, control1, control2, to);
	} else if (control) {
		return makeQuadraticBezier(from, control, to);
	} else {
		return makeLine(from, to);
	}
}

export function convertCurveToCommand(curve: Curve): Command {
	const to = CoordinatePair.fromVector(curve.to);

	switch (curve.type) {
		case 'line':
			return new LineCommand(to);
		case 'quadraticBezier':
			return new CurveCommand(to, CoordinatePair.fromVector(curve.control));
		case 'cubicBezier':
			return new CurveCommand(
				to,
				CoordinatePair.fromVector(curve.control1),
				CoordinatePair.fromVector(curve.control2)
			);
		default:
			assertNever(curve);
	}
}

/**
 * Quadratic bezier interpolation using de Casteljau's algorithm.
 * Given 3 control points, calculates the point at parameter t (0-1) along the curve.
 *
 * @param from Start point
 * @param control Control point
 * @param to End point
 * @param t Parameter from 0 to 1 (0 = start, 1 = end)
 */
export function interpolateQuadraticBezier(
	{ from, control, to }: QuadraticBezier,
	t: number
): Vector {
	// First level: interpolate between adjacent control points
	const q0 = lerp(from, control, t);
	const q1 = lerp(control, to, t);

	// Second level: interpolate between the results
	return lerp(q0, q1, t);
}

/**
 * Cubic bezier interpolation using de Casteljau's algorithm.
 * Given 4 control points, calculates the point at parameter t (0-1) along the curve.
 *
 * @param from Start point
 * @param control1 First control point
 * @param control2 Second control point
 * @param to End point
 * @param t Parameter from 0 to 1 (0 = start, 1 = end)
 */
export function interpolateCubicBezier(
	{ from, control1, control2, to }: CubicBezier,
	t: number
): Vector {
	// First level: interpolate between adjacent control points
	const q0 = lerp(from, control1, t);
	const q1 = lerp(control1, control2, t);
	const q2 = lerp(control2, to, t);

	// Second level: interpolate between the first level results
	const r0 = lerp(q0, q1, t);
	const r1 = lerp(q1, q2, t);

	// Third level: final interpolation
	return lerp(r0, r1, t);
}

export function interpolateCurve(curve: Curve, t: number): Vector {
	switch (curve.type) {
		case 'quadraticBezier':
			return interpolateQuadraticBezier(curve, t);
		case 'cubicBezier':
			return interpolateCubicBezier(curve, t);
		case 'line':
			return lerp(curve.from, curve.to, t);
		default:
			assertNever(curve);
	}
}

/**
 * Find the closest point on a quadratic bezier curve to a given point.
 * Uses sampling to approximate the closest point.
 */
export function closestPointOnQuadraticBezier(
	curve: QuadraticBezier,
	point: Vector,
	samples: number = 50
): { point: Vector; t: number } {
	let closestDistance = Infinity;
	let closestT = 0;
	let closestPoint = curve.from;

	// Sample points along the curve
	for (let i = 0; i <= samples; i++) {
		const t = i / samples;
		const curvePoint = interpolateQuadraticBezier(curve, t);
		const dist = distance(curvePoint, point);

		if (dist < closestDistance) {
			closestDistance = dist;
			closestT = t;
			closestPoint = curvePoint;
		}
	}

	// Refine the result with a smaller search around the best t
	const refinementRange = 1 / samples;
	const refinementSamples = 10;

	for (let i = 0; i <= refinementSamples; i++) {
		const t = clamp(
			closestT - refinementRange + (i / refinementSamples) * 2 * refinementRange,
			0,
			1
		);
		const curvePoint = interpolateQuadraticBezier(curve, t);
		const dist = distance(curvePoint, point);

		if (dist < closestDistance) {
			closestDistance = dist;
			closestT = t;
			closestPoint = curvePoint;
		}
	}

	return { point: closestPoint, t: closestT };
}

/**
 * Find the closest point on a cubic bezier curve to a given point.
 * Uses sampling to approximate the closest point.
 */
export function closestPointOnCubicBezier(
	curve: CubicBezier,
	point: Vector,
	samples: number = 50
): { point: Vector; t: number } {
	let closestDistance = Infinity;
	let closestT = 0;
	let closestPoint = curve.from;

	// Sample points along the curve
	for (let i = 0; i <= samples; i++) {
		const t = i / samples;
		const curvePoint = interpolateCubicBezier(curve, t);
		const dist = distance(curvePoint, point);

		if (dist < closestDistance) {
			closestDistance = dist;
			closestT = t;
			closestPoint = curvePoint;
		}
	}

	// Refine the result with a smaller search around the best t
	const refinementRange = 1 / samples;
	const refinementSamples = 10;

	for (let i = 0; i <= refinementSamples; i++) {
		const t = Math.max(
			0,
			Math.min(1, closestT - refinementRange + (i / refinementSamples) * 2 * refinementRange)
		);
		const curvePoint = interpolateCubicBezier(curve, t);
		const dist = distance(curvePoint, point);

		if (dist < closestDistance) {
			closestDistance = dist;
			closestT = t;
			closestPoint = curvePoint;
		}
	}

	return { point: closestPoint, t: closestT };
}

export function closestPointOnCurve(curve: Curve, point: Vector) {
	switch (curve.type) {
		case 'cubicBezier':
			return closestPointOnCubicBezier(curve, point);
		case 'quadraticBezier':
			return closestPointOnQuadraticBezier(curve, point);
		case 'line':
			return closestPointOnLine(curve.from, curve.to, point);
		default:
			assertNever(curve);
	}
}
