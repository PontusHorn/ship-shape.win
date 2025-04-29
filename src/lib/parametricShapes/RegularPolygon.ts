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

	get #isRotated(): boolean {
		return this.rotation % 1 !== 0;
	}

	get #coordinates(): CoordinatePair[] {
		const coordinates: CoordinatePair[] = [];
		for (let i = 0; i < this.sides; i++) {
			const angle = this.#isRotated
				? `calc(var(--rotation) + ${i}turn / var(--sides))`
				: `calc(${i}turn / var(--sides))`;
			const x = raw(`calc(var(--center-x) + var(--radius) * cos(${angle}))`);
			const y = raw(`calc(var(--center-y) + var(--radius) * sin(${angle}))`);
			coordinates.push(new CoordinatePair(x, y));
		}
		return coordinates;
	}

	get #customProperties(): Record<string, string> {
		const properties: Record<string, string> = {
			['--sides']: this.sides.toString(),
			['--radius']: this.radius.toString(),
			['--rotation']: `calc(${this.rotation}turn / var(--sides))`,
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
