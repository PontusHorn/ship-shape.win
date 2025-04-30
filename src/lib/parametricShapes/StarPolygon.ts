import { From } from '$lib/commands/From';
import { Line } from '$lib/commands/Line';
import { CoordinatePair } from '$lib/CoordinatePair';
import { percent, raw, type LengthPercentage } from '$lib/LengthPercentage';
import { Shape } from '$lib/Shape';
import type { ParametricShape } from './ParametricShape';

export class StarPolygon implements ParametricShape {
	points: number;
	outerRadius: LengthPercentage;
	innerRadius: LengthPercentage;
	center: CoordinatePair;
	rotation: number;

	constructor(
		points: number,
		outerRadius: LengthPercentage = percent(50),
		innerRadius: LengthPercentage = percent(20),
		center = new CoordinatePair(percent(50), percent(50)),
		rotation = 0
	) {
		this.points = points;
		this.outerRadius = outerRadius;
		this.innerRadius = innerRadius;
		this.center = center;
		this.rotation = rotation;
	}

	get #isRotated(): boolean {
		return this.rotation % 1 !== 0;
	}

	get #coordinates(): CoordinatePair[] {
		const coordinates: CoordinatePair[] = [];
		for (let i = 0; i < this.points; i++) {
			const pointAngle = this.#isRotated
				? `calc(var(--rotation) + ${i}turn / var(--points))`
				: `calc(${i}turn / var(--points))`;
			const pointX = raw(`calc(var(--center-x) + var(--outer-radius) * cos(${pointAngle}))`);
			const pointY = raw(`calc(var(--center-y) + var(--outer-radius) * sin(${pointAngle}))`);
			coordinates.push(new CoordinatePair(pointX, pointY));

			const innerAngle = this.#isRotated
				? `calc(var(--rotation) + ${i + 0.5}turn / var(--points))`
				: `calc(${i + 0.5}turn / var(--points))`;
			const innerX = raw(`calc(var(--center-x) + var(--inner-radius) * cos(${innerAngle}))`);
			const innerY = raw(`calc(var(--center-y) + var(--inner-radius) * sin(${innerAngle}))`);
			coordinates.push(new CoordinatePair(innerX, innerY));
		}
		return coordinates;
	}

	get #customProperties(): Record<string, string> {
		const properties: Record<string, string> = {
			['--points']: this.points.toString(),
			['--outer-radius']: this.outerRadius.toString(),
			['--inner-radius']: this.innerRadius.toString(),
			['--rotation']: `calc(${this.rotation}turn / var(--points))`,
			['--center-x']: this.center.x.toString(),
			['--center-y']: this.center.y.toString()
		};

		if (!this.#isRotated) {
			delete properties['--rotation'];
		}

		return properties;
	}

	toShape(): Shape {
		const [fromCoordinate, ...restCoordinates] = this.#coordinates;
		return new Shape(
			new From(fromCoordinate),
			restCoordinates.map((coordinate) => new Line(coordinate))
		);
	}

	toCSS(propertyName: string): string {
		const properties = this.#customProperties;
		properties[propertyName] = this.toShape().toString();

		return Object.entries(properties)
			.map(([key, value]) => `${key}: ${value};`)
			.join('\n');
	}
}
