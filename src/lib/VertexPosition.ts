import { Position } from './Position';
import { VertexDimension } from './VertexDimension';
import type { Vector } from './vector';

export class VertexPosition {
	x: VertexDimension;
	y: VertexDimension;

	constructor(x: VertexDimension, y: VertexDimension) {
		this.x = x;
		this.y = y;
	}

	withX(x: VertexDimension): VertexPosition {
		return new VertexPosition(x, this.y);
	}

	withY(y: VertexDimension): VertexPosition {
		return new VertexPosition(this.x, y);
	}

	withVector([x, y]: Vector, [maxX, maxY]: Vector): VertexPosition {
		return new VertexPosition(
			VertexDimension.fromPixels(this.x.type, maxX, x),
			VertexDimension.fromPixels(this.y.type, maxY, y)
		);
	}

	toRounded(): VertexPosition {
		return new VertexPosition(this.x.toRounded(), this.y.toRounded());
	}

	toTranslated([deltaX, deltaY]: Vector, [maxX, maxY]: Vector): VertexPosition {
		return new VertexPosition(this.x.toTranslated(deltaX, maxX), this.y.toTranslated(deltaY, maxY));
	}

	toMirrored(origin: VertexPosition, [maxX, maxY]: Vector): VertexPosition {
		return new VertexPosition(this.x.toMirrored(origin.x, maxX), this.y.toMirrored(origin.y, maxY));
	}

	toPosition(): Position {
		return new Position(this.x.toLengthPercentage(), this.y.toLengthPercentage());
	}

	toVector([maxX, maxY]: Vector): Vector {
		return [this.x.toPixels(maxX), this.y.toPixels(maxY)];
	}
}
