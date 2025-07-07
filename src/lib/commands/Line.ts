import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import { type XDimension, type YDimension } from '$lib/Position';
import { Position } from '$lib/Position';
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
		const parts = [`line ${this.method}`, this.coords.x, this.coords.y];

		const oneLiner = parts.join(' ');
		if (oneLiner.length <= 80) {
			return oneLiner;
		}

		return parts.join('\n\t\t');
	}

	toSvgCommand() {
		return `L ${this.coords.toSvgPoint()}`;
	}
}

export function lineBy(x: LengthPercentage, y: LengthPercentage) {
	return new Line(new CoordinatePair(x, y), 'by');
}

export function lineTo(x: XDimension, y: YDimension) {
	return new Line(new Position(x, y), 'to');
}
