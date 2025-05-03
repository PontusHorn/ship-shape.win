import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import { Position, type XDimension, type YDimension } from '$lib/Position';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Curve implements Command {
	method: MoveMethod;
	coords: CoordinatePair | Position;
	withCoords: CoordinatePair | Position;

	constructor(
		coords: CoordinatePair | Position,
		withCoords: CoordinatePair | Position,
		method: MoveMethod = 'to'
	) {
		if (method === 'by' && !(coords instanceof CoordinatePair)) {
			throw new Error(`Must use a CoordinatePair as coords when using the 'by' method`);
		}

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
	withX: XDimension,
	withY: YDimension
) {
	return new Curve(new CoordinatePair(x, y), new Position(withX, withY), 'by');
}

export function curveTo(x: XDimension, y: YDimension, withX: XDimension, withY: YDimension) {
	return new Curve(new Position(x, y), new Position(withX, withY), 'to');
}
