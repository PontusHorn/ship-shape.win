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
