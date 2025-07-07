import { type LengthPercentage, px } from './LengthPercentage';

export class CoordinatePair {
	x: LengthPercentage;
	y: LengthPercentage;

	constructor(x: LengthPercentage = px(0), y: LengthPercentage = px(0)) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return `${this.x} ${this.y}`;
	}

	toSvgPoint() {
		return `${this.x},${this.y}`;
	}
}
