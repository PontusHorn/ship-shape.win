import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Move implements Command {
	method: MoveMethod;
	coords: CoordinatePair;

	constructor(coords: CoordinatePair, method: MoveMethod = 'to') {
		this.coords = coords;
		this.method = method;
	}

	toString() {
		return `move ${this.method}\n\t\t${this.coords.x}\n\t\t${this.coords.y}`;
	}
}

export function moveBy(x: LengthPercentage, y: LengthPercentage) {
	return new Move(new CoordinatePair(x, y), 'by');
}

export function moveTo(x: LengthPercentage, y: LengthPercentage) {
	return new Move(new CoordinatePair(x, y), 'to');
}
