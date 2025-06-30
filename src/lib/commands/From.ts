import { Position, type XDimension, type YDimension } from '$lib/Position';
import type { Command } from './Command';

export class From implements Command {
	coords: Position;

	constructor(coords: Position = new Position()) {
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
}

export function from(x: XDimension, y: YDimension) {
	return new From(new Position(x, y));
}
