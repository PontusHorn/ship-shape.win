import type { Command } from '$lib/commands/Command';
import { CurveCommand } from '$lib/commands/Curve';
import { FromCommand } from '$lib/commands/From';
import { LineCommand } from '$lib/commands/Line';
import { CoordinatePair } from '$lib/CoordinatePair';
import type { CssProperties } from '$lib/util/css';
import { raw, percent, px, type BaseUnit } from '$lib/LengthPercentage';
import { getShapeCssProperties } from '$lib/util/output';
import type { OutputConfig } from '$lib/outputConfig.svelte';
import { Shape } from '$lib/Shape';
import type { Vector } from '$lib/util/vector';
import type { ParametricShape } from './ParametricShape';

export class RegularPolygon implements ParametricShape {
	sides: number;
	unit: BaseUnit;
	radius: number;
	center: Vector;
	rotation: number;
	swell: number;

	constructor(
		sides: number,
		unit: BaseUnit = 'percent',
		radius: number = 50,
		center: Vector = [50, 50],
		rotation = 0,
		swell: number = 1
	) {
		this.sides = sides;
		this.unit = unit;
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

	get #unitFactory() {
		return this.unit === 'percent' ? percent : px;
	}

	#getCornerCoordinates(pointIndex: number): CoordinatePair {
		const angle = this.#isRotated
			? `var(--rotation) + ${pointIndex}turn / var(--sides)`
			: `${pointIndex}turn / var(--sides)`;
		const rawAngle = this.rotation + (pointIndex * Math.PI * 2) / this.sides;

		const x = raw(
			`calc(var(--center-x) + var(--radius) * cos(${angle}))`,
			this.#unitFactory(this.center[0] + this.radius * Math.cos(rawAngle))
		);
		const y = raw(
			`calc(var(--center-y) + var(--radius) * sin(${angle}))`,
			this.#unitFactory(this.center[1] + this.radius * Math.sin(rawAngle))
		);

		return new CoordinatePair(x, y);
	}

	#getSwellCoordinates(toPointIndex: number): CoordinatePair {
		const angle = this.#isRotated
			? `var(--rotation) + ${toPointIndex - 0.5}turn / var(--sides)`
			: `${toPointIndex - 0.5}turn / var(--sides)`;
		const rawAngle = this.rotation + ((toPointIndex - 0.5) * Math.PI * 2) / this.sides;

		const swellRadius = this.radius * Math.cos(Math.PI / this.sides) * this.swell;

		const x = raw(
			`calc(var(--center-x) + var(--swell-radius) * cos(${angle}))`,
			this.#unitFactory(this.center[0] + swellRadius * Math.cos(rawAngle))
		);
		const y = raw(
			`calc(var(--center-y) + var(--swell-radius) * sin(${angle}))`,
			this.#unitFactory(this.center[1] + swellRadius * Math.sin(rawAngle))
		);

		return new CoordinatePair(x, y);
	}

	get #customProperties(): CssProperties {
		const properties: CssProperties = {
			['--sides']: this.sides.toString(),
			['--radius']: this.#unitFactory(this.radius).toCss(),
			['--swell']: this.swell.toString(),
			['--swell-radius']: `calc(var(--radius) * cos(pi / var(--sides)) * var(--swell))`,
			['--rotation']: `calc(${this.rotation}turn / var(--sides))`,
			['--center-x']: this.#unitFactory(this.center[0]).toCss(),
			['--center-y']: this.#unitFactory(this.center[1]).toCss()
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
		const from = new FromCommand(this.#getCornerCoordinates(0));
		const commands: Command[] = [];
		for (let i = 1; i <= this.sides; i++) {
			const cornerCoordinates = this.#getCornerCoordinates(i);
			const swellCoordinates = this.#getSwellCoordinates(i);
			commands.push(
				this.#hasSwell
					? new CurveCommand(cornerCoordinates, swellCoordinates)
					: new LineCommand(cornerCoordinates)
			);
		}
		return new Shape(from, commands);
	}

	toCssProperties({ shapeProperty, codeStyle }: OutputConfig) {
		const properties = {
			...(codeStyle === 'default' ? this.#customProperties : {}),
			...getShapeCssProperties(this.toShape(), shapeProperty, codeStyle)
		};

		return properties;
	}
}
