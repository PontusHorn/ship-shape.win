import { VertexPosition } from './editor/VertexPosition';
import { type CodeStyle, type LengthPercentage, px } from './LengthPercentage';
import type { Vector } from './util/vector';

export class CoordinatePair {
	x: LengthPercentage;
	y: LengthPercentage;

	constructor(x: LengthPercentage = px(0), y: LengthPercentage = px(0)) {
		this.x = x;
		this.y = y;
	}

	toCss(style: CodeStyle) {
		return `${this.x.toCss(style)} ${this.y.toCss(style)}`;
	}

	toSvgPoint() {
		return `${this.x.toSvg()},${this.y.toSvg()}`;
	}

	toVertexPosition(): VertexPosition {
		return new VertexPosition(this.x.toVertexDimension(), this.y.toVertexDimension());
	}

	static fromVector([x, y]: Vector): CoordinatePair {
		return new CoordinatePair(px(x), px(y));
	}
}
