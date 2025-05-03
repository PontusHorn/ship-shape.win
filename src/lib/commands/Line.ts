import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import { Position, type XDimension, type YDimension } from '$lib/Position';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Line implements Command {
	method: MoveMethod;
	coords: CoordinatePair | Position;

	constructor(coords: CoordinatePair | Position, method: MoveMethod = 'to') {
		if (method === 'by' && !(coords instanceof CoordinatePair)) {
			throw new Error(`Must use a CoordinatePair as coords when using the 'by' method`);
		}

		this.coords = coords;
		this.method = method;
	}

	toString() {
		return `line ${this.method}\n\t\t${this.coords.x}\n\t\t${this.coords.y}`;
	}
}

export function lineBy(x: LengthPercentage, y: LengthPercentage) {
	return new Line(new CoordinatePair(x, y), 'by');
}

export function lineTo(x: XDimension, y: YDimension) {
	return new Line(new Position(x, y), 'to');
}
