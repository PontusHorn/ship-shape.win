import { CoordinatePair } from '$lib/CoordinatePair';
import type { CodeStyle, LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Move implements Command {
	method: MoveMethod;
	coords: CoordinatePair;

	constructor(coords: CoordinatePair, method: MoveMethod = 'to') {
		this.coords = coords;
		this.method = method;
	}

	toCss(style: CodeStyle) {
		return `move ${this.method}\n\t\t${this.coords.x.toCss(style)}\n\t\t${this.coords.y.toCss(style)}`;
	}

	toSvgCommand(): string {
		return `M ${this.coords.toSvgPoint()}`;
	}
}

export function moveBy(x: LengthPercentage, y: LengthPercentage) {
	return new Move(new CoordinatePair(x, y), 'by');
}

export function moveTo(x: LengthPercentage, y: LengthPercentage) {
	return new Move(new CoordinatePair(x, y), 'to');
}
