import { close } from '$lib/commands/Close';
import type { Command } from '$lib/commands/Command';
import { Curve } from '$lib/commands/Curve';
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
	swell: number;

	constructor(
		sides: number,
		radius: LengthPercentage = percent(50),
		center = new CoordinatePair(percent(50), percent(50)),
		rotation = 0,
		swell: number = 1
	) {
		this.sides = sides;
		this.radius = radius;
		this.center = center;
		this.rotation = rotation;
		this.swell = swell;
	}

	get #isRotated(): boolean {
		return this.rotation % 1 !== 0;
	}

	get #hasSwell(): boolean {
		return this.swell !== 1;
	}

	#getCornerCoordinates(pointIndex: number): CoordinatePair {
		const angle = this.#isRotated
			? `var(--rotation) + ${pointIndex}turn / var(--sides)`
			: `${pointIndex}turn / var(--sides)`;
		const x = raw(`calc(var(--center-x) + var(--radius) * cos(${angle}))`);
		const y = raw(`calc(var(--center-y) + var(--radius) * sin(${angle}))`);
		return new CoordinatePair(x, y);
	}

	#getSwellCoordinates(toPointIndex: number): CoordinatePair {
		const angle = this.#isRotated
			? `var(--rotation) + ${toPointIndex - 0.5}turn / var(--sides)`
			: `${toPointIndex - 0.5}turn / var(--sides)`;
		const x = raw(`calc(var(--center-x) + var(--swell-radius) * cos(${angle}))`);
		const y = raw(`calc(var(--center-y) + var(--swell-radius) * sin(${angle}))`);
		return new CoordinatePair(x, y);
	}

	get #customProperties(): Record<string, string> {
		const properties: Record<string, string> = {
			['--sides']: this.sides.toString(),
			['--radius']: this.radius.toString(),
			['--swell']: this.swell.toString(),
			['--swell-radius']: `calc(${this.radius.toString()} * cos(pi / var(--sides)) * var(--swell))`,
			['--rotation']: `calc(${this.rotation}turn / var(--sides))`,
			['--center-x']: this.center.x.toString(),
			['--center-y']: this.center.y.toString()
		};

		if (!this.#isRotated) {
			delete properties['--rotation'];
		}

		if (!this.#hasSwell) {
			delete properties['--swell-radius'];
			delete properties['--swell'];
		}

		return properties;
	}

	toShape(): Shape {
		const from = new From(this.#getCornerCoordinates(0));
		const commands: Command[] = [];
		for (let i = 1; i <= this.sides; i++) {
			const cornerCoordinates = this.#getCornerCoordinates(i);
			const swellCoordinates = this.#getSwellCoordinates(i);
			commands.push(
				this.#hasSwell
					? new Curve(cornerCoordinates, swellCoordinates)
					: new Line(cornerCoordinates)
			);
		}
		commands.push(close());
		return new Shape(from, commands);
	}

	toCSS(propertyName: string): string {
		const properties = this.#customProperties;
		properties[propertyName] = this.toShape().toString();

		return Object.entries(properties)
			.map(([key, value]) => `${key}: ${value};`)
			.join('\n');
	}
}
