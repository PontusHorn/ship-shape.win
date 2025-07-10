import { CoordinatePair } from '$lib/CoordinatePair';
import type { CodeStyle, LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';

export class From implements Command {
	coords: CoordinatePair;

	constructor(coords: CoordinatePair = new CoordinatePair()) {
		this.coords = coords;
	}

	toCss(style: CodeStyle) {
		const parts = ['from', this.coords.x.toCss(style), this.coords.y.toCss(style)];

		const oneLiner = parts.join(' ');
		if (oneLiner.length <= 80) {
			return oneLiner;
		}

		return parts.join('\n\t\t');
	}

	toSvgCommand() {
		return `M ${this.coords.toSvgPoint()}`;
	}
}

export function from(x: LengthPercentage, y: LengthPercentage) {
	return new From(new CoordinatePair(x, y));
}
