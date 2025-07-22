import { CoordinatePair } from '$lib/CoordinatePair';
import type { CodeStyle, LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class LineCommand implements Command {
	method: MoveMethod;
	coords: CoordinatePair;

	constructor(coords: CoordinatePair, method: MoveMethod = 'to') {
		this.coords = coords;
		this.method = method;
	}

	toCss(style: CodeStyle) {
		const parts = [`line ${this.method}`, this.coords.x.toCss(style), this.coords.y.toCss(style)];

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
	return new LineCommand(new CoordinatePair(x, y), 'by');
}

export function lineTo(x: LengthPercentage, y: LengthPercentage) {
	return new LineCommand(new CoordinatePair(x, y), 'to');
}
