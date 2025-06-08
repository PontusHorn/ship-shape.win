import { Position } from './Position';
import type { VertexDimension } from './VertexDimension';

export class VertexPosition {
	x: VertexDimension;
	y: VertexDimension;

	constructor(x: VertexDimension, y: VertexDimension) {
		this.x = $state(x);
		this.y = $state(y);
	}

	toPosition(): Position {
		return new Position(this.x.toLengthPercentage(), this.y.toLengthPercentage());
	}
}
