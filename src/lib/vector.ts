export type Vector = [x: number, y: number];

export function translate(subject: Vector, by: Vector): Vector {
	return [subject[0] + by[0], subject[1] + by[1]];
}

export function subtract(subject: Vector, vector: Vector): Vector {
	return [subject[0] - vector[0], subject[1] - vector[1]];
}

export function lerp(a: Vector, b: Vector, t: number): Vector {
	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
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
export function quadraticBezier(from: Vector, control: Vector, to: Vector, t: number): Vector {
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
export function cubicBezier(
	from: Vector,
	control1: Vector,
	control2: Vector,
	to: Vector,
	t: number
): Vector {
	// First level: interpolate between adjacent control points
	const q0 = lerp(from, control1, t);
	const q1 = lerp(control1, control2, t);
	const q2 = lerp(control2, to, t);

	// Second level: interpolate between the first level results
	const r0 = lerp(q0, q1, t);
	const r1 = lerp(q1, q2, t);

	console.log({ q0, q1, q2, r0, r1 });

	// Third level: final interpolation
	return lerp(r0, r1, t);
}

export function interpolateCurve(
	from: Vector,
	controlPoint1: Vector | undefined,
	controlPoint2: Vector | undefined,
	to: Vector,
	t: number
): Vector {
	if (!controlPoint1 && !controlPoint2) {
		// Linear interpolation when no control points
		return lerp(from, to, t);
	} else if (controlPoint1 && controlPoint2) {
		// Cubic bezier curve with both control points
		return cubicBezier(from, controlPoint1, controlPoint2, to, t);
	} else {
		// Quadratic bezier curve with one control point
		const controlPoint = controlPoint1 || controlPoint2!;
		return quadraticBezier(from, controlPoint, to, t);
	}
}
