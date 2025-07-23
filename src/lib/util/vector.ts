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
 * Calculate the Euclidean distance between two points.
 */
export function distance(a: Vector, b: Vector): number {
	const dx = b[0] - a[0];
	const dy = b[1] - a[1];
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Find the closest point on a line segment to a given point.
 * Returns both the closest point and the parameter t (0-1) along the line.
 */
export function closestPointOnLine(
	lineStart: Vector,
	lineEnd: Vector,
	point: Vector
): { point: Vector; t: number } {
	const lineVector = subtract(lineEnd, lineStart);
	const pointVector = subtract(point, lineStart);

	// Project point onto line
	const lineLengthSquared = lineVector[0] ** 2 + lineVector[1] ** 2;
	if (lineLengthSquared === 0) {
		// Line has zero length, return the start point
		return { point: lineStart, t: 0 };
	}

	const t = Math.max(
		0,
		Math.min(
			1,
			(pointVector[0] * lineVector[0] + pointVector[1] * lineVector[1]) / lineLengthSquared
		)
	);

	return {
		point: lerp(lineStart, lineEnd, t),
		t
	};
}
