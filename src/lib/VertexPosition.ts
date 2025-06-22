import { Position } from './Position';
import type { VertexDimension } from './VertexDimension';

export class VertexPosition {
	x: VertexDimension;
	y: VertexDimension;

	constructor(x: VertexDimension, y: VertexDimension) {
		this.x = x;
		this.y = y;
	}

	toMirrored(origin: VertexPosition, maxX: number, maxY: number): VertexPosition {
		return new VertexPosition(this.x.toMirrored(origin.x, maxX), this.y.toMirrored(origin.y, maxY));
	}

	toPosition(): Position {
		return new Position(this.x.toLengthPercentage(), this.y.toLengthPercentage());
	}
}
