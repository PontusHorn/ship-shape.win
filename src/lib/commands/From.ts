import { Position, type XDimension, type YDimension } from '$lib/Position';
import type { Command } from './Command';

export class From implements Command {
	coords: Position;

	constructor(coords: Position = new Position()) {
		this.coords = coords;
	}

	toString() {
		return `from\n\t\t${this.coords.x}\n\t\t${this.coords.y}`;
	}
}

export function from(x: XDimension, y: YDimension) {
	return new From(new Position(x, y));
}
