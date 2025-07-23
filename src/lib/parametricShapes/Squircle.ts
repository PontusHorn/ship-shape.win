import { curveTo } from '$lib/commands/Curve';
import { from } from '$lib/commands/From';
import type { CssProperties } from '$lib/util/css';
import { raw, percent, px, type BaseUnit } from '$lib/LengthPercentage';
import { getShapeCssProperties } from '$lib/util/output';
import type { OutputConfig } from '$lib/outputConfig.svelte';
import { Shape } from '$lib/Shape';
import type { Vector } from '$lib/util/vector';
import type { ParametricShape } from './ParametricShape';

export class Squircle implements ParametricShape {
	unit: BaseUnit;
	curvature: number;

	constructor(unit: BaseUnit = 'percent', curvature = 50) {
		this.unit = unit;
		this.curvature = curvature;
	}

	get #unitFactory() {
		return this.unit === 'percent' ? percent : px;
	}

	get #customProperties(): CssProperties {
		const properties: CssProperties = {
			['--curvature']: this.#unitFactory(this.curvature).toCss(),
			['--start']: `var(--curvature)`,
			['--end']: `calc(100% - var(--curvature))`
		};

		return properties;
	}

	toShape([maxX, maxY]: Vector): Shape {
		const start = percent(0);
		const center = percent(50);
		const end = percent(100);

		const curveLeft = raw(`var(--start)`, this.#unitFactory(this.curvature));
		const curveUp = raw(`var(--start)`, this.#unitFactory(this.curvature));
		const curveRight = raw(
			`var(--end)`,
			this.unit === 'percent' ? percent(100 - this.curvature) : px(maxX - this.curvature)
		);
		const curveDown = raw(
			`var(--end)`,
			this.unit === 'percent' ? percent(100 - this.curvature) : px(maxY - this.curvature)
		);
		return new Shape(from(center, start), [
			curveTo([end, center], [curveRight, start], [end, curveUp]),
			curveTo([center, end], [end, curveDown], [curveRight, end]),
			curveTo([start, center], [curveLeft, end], [start, curveDown]),
			curveTo([center, start], [start, curveUp], [curveLeft, start])
		]);
	}

	toCssProperties({ shapeProperty, codeStyle, previewSize }: OutputConfig) {
		const properties = {
			...(codeStyle === 'default' ? this.#customProperties : {}),
			...getShapeCssProperties(this.toShape(previewSize), shapeProperty, codeStyle)
		};

		return properties;
	}
}
