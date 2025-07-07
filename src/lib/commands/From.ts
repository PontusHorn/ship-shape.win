import type { CoordinatePair } from '$lib/CoordinatePair';
import { Position, type XDimension, type YDimension } from '$lib/Position';
import type { Command } from './Command';

export class From implements Command {
	coords: CoordinatePair | Position;

	constructor(coords: CoordinatePair | Position = new Position()) {
		this.coords = coords;
	}

	toString() {
		const parts = ['from', this.coords.x, this.coords.y];

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

export function from(x: XDimension, y: YDimension) {
	return new From(new Position(x, y));
}
