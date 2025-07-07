import { CoordinatePair } from './CoordinatePair';
import { type LengthPercentage, percent, px } from './LengthPercentage';

export class Position {
	x: XDimension;
	y: YDimension;

	constructor(x: XDimension = px(0), y: YDimension = px(0)) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return `${this.x} ${this.y}`;
	}

	toSvgPoint() {
		return this.toCoordinatePair().toSvgPoint();
	}

	toCoordinatePair() {
		return new CoordinatePair(
			dimensionToLengthPercentage(this.x),
			dimensionToLengthPercentage(this.y)
		);
	}
}

export type XDimension = LengthPercentage | 'left' | 'center' | 'right';
export type YDimension = LengthPercentage | 'top' | 'center' | 'bottom';

function dimensionToLengthPercentage(dimension: XDimension | YDimension): LengthPercentage {
	switch (dimension) {
		case 'left':
		case 'top':
			return percent(0);
		case 'center':
			return percent(50);
		case 'right':
		case 'bottom':
			return percent(100);
		default:
			return dimension;
	}
}
