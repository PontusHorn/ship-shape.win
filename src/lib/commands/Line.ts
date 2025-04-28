import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Line implements Command {
	method: MoveMethod;
	coords: CoordinatePair;

	constructor(coords: CoordinatePair, method: MoveMethod = 'to') {
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

export function lineTo(x: LengthPercentage, y: LengthPercentage) {
	return new Line(new CoordinatePair(x, y), 'to');
}
