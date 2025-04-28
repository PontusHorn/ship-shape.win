import { CoordinatePair } from '$lib/CoordinatePair';
import type { LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';

export class From implements Command {
	coords: CoordinatePair;

	constructor(coords: CoordinatePair = new CoordinatePair()) {
		this.coords = coords;
	}

	toString() {
		return `from\n\t\t${this.coords.x}\n\t\t${this.coords.y}`;
	}
}

export function from(x: LengthPercentage, y: LengthPercentage) {
	return new From(new CoordinatePair(x, y));
}
