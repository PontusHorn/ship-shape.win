import { From } from '$lib/commands/From';
import { Line } from '$lib/commands/Line';
import { CoordinatePair } from '$lib/CoordinatePair';
import { percent, raw, type LengthPercentage } from '$lib/LengthPercentage';
import { Shape } from '$lib/Shape';
import type { ParametricShape } from './ParametricShape';

export class RegularPolygon implements ParametricShape {
	sides: number;
	radius: LengthPercentage;
	center: CoordinatePair;
	rotation: number;

	constructor(
		sides: number,
		radius: LengthPercentage = percent(50),
		center = new CoordinatePair(percent(50), percent(50)),
		rotation = 0
	) {
		this.sides = sides;
		this.radius = radius;
		this.center = center;
		this.rotation = rotation;
	}

	get #coordinates(): CoordinatePair[] {
		const coordinates: CoordinatePair[] = [];
		for (let i = 0; i < this.sides; i++) {
			const angle =
				this.rotation % 1 !== 0
					? `calc((${i}turn + ${this.rotation}turn) / ${this.sides})`
					: `calc(${i}turn / ${this.sides})`;
			const x = raw(`calc(${this.center.x} + ${this.radius} * cos(${angle}))`);
			const y = raw(`calc(${this.center.y} + ${this.radius} * sin(${angle}))`);
			coordinates.push(new CoordinatePair(x, y));
		}
		return coordinates;
	}

	toShape(): Shape {
		const [fromCoordinate, ...restCoordinates] = this.#coordinates;
		return new Shape(
			new From(fromCoordinate),
			restCoordinates.map((coordinate) => new Line(coordinate))
		);
	}
}
