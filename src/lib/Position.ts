import { type LengthPercentage, px } from './LengthPercentage';

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
}

export type XDimension = LengthPercentage | 'left' | 'center' | 'right';
export type YDimension = LengthPercentage | 'top' | 'center' | 'bottom';
