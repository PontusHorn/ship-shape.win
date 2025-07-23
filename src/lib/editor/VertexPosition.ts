import { CoordinatePair } from '../CoordinatePair';
import { VertexDimension, type DimensionType } from './VertexDimension';
import type { Vector } from '../util/vector';

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

	withConvertedDimensionType(
		dimension: 'x' | 'y',
		newType: DimensionType,
		[maxX, maxY]: Vector
	): VertexPosition {
		return dimension === 'x'
			? this.withX(this.x.withConvertedType(newType, maxX))
			: this.withY(this.y.withConvertedType(newType, maxY));
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

	toCoordinatePair([maxX, maxY]: Vector): CoordinatePair {
		return new CoordinatePair(this.x.toLengthPercentage(maxX), this.y.toLengthPercentage(maxY));
	}

	toVector([maxX, maxY]: Vector): Vector {
		return [this.x.toPixels(maxX), this.y.toPixels(maxY)];
	}
}
