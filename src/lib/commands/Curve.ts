import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Curve implements Command {
	method: MoveMethod;
	coords: CoordinatePair;
	withCoords: CoordinatePair;

	constructor(coords: CoordinatePair, withCoords: CoordinatePair, method: MoveMethod = 'to') {
		this.coords = coords;
		this.withCoords = withCoords;
		this.method = method;
	}

	toString() {
		return [
			`curve ${this.method}`,
			`${this.coords.x}`,
			`${this.coords.y}`,
			`with`,
			`${this.withCoords.x}`,
			`${this.withCoords.y}`
		].join('\n\t\t');
	}
}

export function curveBy(
	x: LengthPercentage,
	y: LengthPercentage,
	withX: LengthPercentage,
	withY: LengthPercentage
) {
	return new Curve(new CoordinatePair(x, y), new CoordinatePair(withX, withY), 'by');
}

export function curveTo(
	x: LengthPercentage,
	y: LengthPercentage,
	withX: LengthPercentage,
	withY: LengthPercentage
) {
	return new Curve(new CoordinatePair(x, y), new CoordinatePair(withX, withY), 'to');
}
