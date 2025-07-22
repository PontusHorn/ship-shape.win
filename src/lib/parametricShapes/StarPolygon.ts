import { close } from '$lib/commands/Close';
import type { Command } from '$lib/commands/Command';
import { FromCommand } from '$lib/commands/From';
import { LineCommand } from '$lib/commands/Line';
import { CoordinatePair } from '$lib/CoordinatePair';
import type { CssProperties } from '$lib/css';
import { raw, percent, px, type BaseUnit } from '$lib/LengthPercentage';
import { getShapeCssProperties } from '$lib/output';
import type { OutputConfig } from '$lib/outputConfig.svelte';
import { Shape } from '$lib/Shape';
import type { Vector } from '$lib/vector';
import type { ParametricShape } from './ParametricShape';

export class StarPolygon implements ParametricShape {
	points: number;
	unit: BaseUnit;
	outerRadius: number;
	innerRadius: number;
	center: Vector;
	rotation: number;

	constructor(
		points: number,
		unit: BaseUnit = 'percent',
		outerRadius = 50,
		innerRadius = 20,
		center: Vector = [50, 50],
		rotation = 0
	) {
		this.points = points;
		this.unit = unit;
		this.outerRadius = outerRadius;
		this.innerRadius = innerRadius;
		this.center = center;
		this.rotation = rotation;
	}

	get #isRotated(): boolean {
		return this.rotation % 1 !== 0;
	}

	get #unitFactory() {
		return this.unit === 'percent' ? percent : px;
	}

	get #coordinates(): CoordinatePair[] {
		const coordinates: CoordinatePair[] = [];
		for (let i = 0; i < this.points; i++) {
			const pointAngle = this.#isRotated
				? `calc(var(--rotation) + ${i}turn / var(--points))`
				: `calc(${i}turn / var(--points))`;
			const rawPointAngle = this.rotation + (i * Math.PI * 2) / this.points;

			const pointX = raw(
				`calc(var(--center-x) + var(--outer-radius) * cos(${pointAngle}))`,
				this.#unitFactory(this.center[0] + this.outerRadius * Math.cos(rawPointAngle))
			);
			const pointY = raw(
				`calc(var(--center-y) + var(--outer-radius) * sin(${pointAngle}))`,
				this.#unitFactory(this.center[1] + this.outerRadius * Math.sin(rawPointAngle))
			);

			coordinates.push(new CoordinatePair(pointX, pointY));

			const innerAngle = this.#isRotated
				? `calc(var(--rotation) + ${i + 0.5}turn / var(--points))`
				: `calc(${i + 0.5}turn / var(--points))`;
			const rawInnerAngle = this.rotation + ((i + 0.5) * Math.PI * 2) / this.points;

			const innerX = raw(
				`calc(var(--center-x) + var(--inner-radius) * cos(${innerAngle}))`,
				this.#unitFactory(this.center[0] + this.innerRadius * Math.cos(rawInnerAngle))
			);
			const innerY = raw(
				`calc(var(--center-y) + var(--inner-radius) * sin(${innerAngle}))`,
				this.#unitFactory(this.center[1] + this.innerRadius * Math.sin(rawInnerAngle))
			);

			coordinates.push(new CoordinatePair(innerX, innerY));
		}
		return coordinates;
	}

	get #customProperties(): CssProperties {
		const properties: CssProperties = {
			['--points']: this.points.toString(),
			['--outer-radius']: this.#unitFactory(this.outerRadius).toCss(),
			['--inner-radius']: this.#unitFactory(this.innerRadius).toCss(),
			['--rotation']: `calc(${this.rotation}turn / var(--points))`,
			['--center-x']: this.#unitFactory(this.center[0]).toCss(),
			['--center-y']: this.#unitFactory(this.center[1]).toCss()
		};

		if (!this.#isRotated) {
			delete properties['--rotation'];
		}

		return properties;
	}

	toShape(): Shape {
		const [fromCoordinate, ...restCoordinates] = this.#coordinates;
		const commands: Command[] = restCoordinates.map((coordinate) => new LineCommand(coordinate));
		commands.push(close());
		return new Shape(new FromCommand(fromCoordinate), commands);
	}

	toCssProperties({ shapeProperty, codeStyle }: OutputConfig) {
		const properties = {
			...(codeStyle === 'default' ? this.#customProperties : {}),
			...getShapeCssProperties(this.toShape(), shapeProperty, codeStyle)
		};

		return properties;
	}
}
