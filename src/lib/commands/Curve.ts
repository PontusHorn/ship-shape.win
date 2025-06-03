import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import { Position, type XDimension, type YDimension } from '$lib/Position';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Curve implements Command {
	method: MoveMethod;
	coords: CoordinatePair | Position;
	withCoords: CoordinatePair | Position;
	withCoords2?: CoordinatePair | Position;

	constructor(
		coords: CoordinatePair | Position,
		withCoords: CoordinatePair | Position,
		withCoords2?: CoordinatePair | Position,
		method: MoveMethod = 'to'
	) {
		if (method === 'by' && !(coords instanceof CoordinatePair)) {
			throw new Error(`Must use a CoordinatePair as coords when using the 'by' method`);
		}

		this.coords = coords;
		this.withCoords = withCoords;
		this.withCoords2 = withCoords2;
		this.method = method;
	}

	toString() {
		return [
			`curve ${this.method} ${this.coords.x} ${this.coords.y}`,
			`\twith ${this.withCoords.x} ${this.withCoords.y}`,
			this.withCoords2 ? `\t/ ${this.withCoords2.x} ${this.withCoords2.y}` : ''
		].join('\n\t\t');
	}
}

export function curveBy(
	coords: [LengthPercentage, LengthPercentage],
	controlPoint1: [XDimension, YDimension],
	controlPoint2?: [XDimension, YDimension]
) {
	return new Curve(
		new CoordinatePair(...coords),
		new Position(...controlPoint1),
		controlPoint2 ? new Position(...controlPoint2) : undefined,
		'by'
	);
}

export function curveTo(
	coords: [XDimension, YDimension],
	controlPoint1: [XDimension, YDimension],
	controlPoint2?: [XDimension, YDimension]
) {
	return new Curve(
		new Position(...coords),
		new Position(...controlPoint1),
		controlPoint2 ? new Position(...controlPoint2) : undefined,
		'to'
	);
}
