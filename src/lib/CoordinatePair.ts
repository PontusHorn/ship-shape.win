import { LengthPercentage, px } from './LengthPercentage';

export class CoordinatePair {
	x: LengthPercentage;
	y: LengthPercentage;

	constructor(x = px(0), y = px(0)) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return `${this.x} ${this.y}`;
	}
}
