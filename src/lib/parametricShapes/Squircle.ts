import { curveTo } from '$lib/commands/Curve';
import { from } from '$lib/commands/From';
import { percent, raw, type LengthPercentage } from '$lib/LengthPercentage';
import { Shape } from '$lib/Shape';
import type { ParametricShape } from './ParametricShape';

export class Squircle implements ParametricShape {
	curvature: LengthPercentage;

	constructor(curvature: LengthPercentage = percent(50)) {
		this.curvature = curvature;
	}

	get #customProperties(): Record<string, string> {
		console.log(this.curvature);
		const properties: Record<string, string> = {
			['--curvature']:
				/* this.curvature instanceof Percent
					?  */ this.curvature.toString(),
			// Cap to 50% to prevent overflow
			// : `min(${this.curvature.toString()}, 50%)`,
			['--right']: `calc(100% - var(--curvature))`,
			['--down']: `calc(100% - var(--curvature))`,
			['--left']: `calc(var(--curvature))`,
			['--up']: `calc(var(--curvature))`
		};

		return properties;
	}

	toShape(): Shape {
		return new Shape(from('center', 'top'), [
			curveTo(['right', 'center'], [raw(`var(--right)`), 'top'], ['right', raw(`var(--up)`)]),
			curveTo(['center', 'bottom'], ['right', raw(`var(--down)`)], [raw(`var(--right)`), 'bottom']),
			curveTo(['left', 'center'], [raw(`var(--left)`), 'bottom'], ['left', raw(`var(--down)`)]),
			curveTo(['center', 'top'], ['left', raw(`var(--up)`)], [raw(`var(--left)`), 'top'])
		]);
	}

	toCssProperties(propertyName: string) {
		const properties = this.#customProperties;
		properties[propertyName] = this.toShape().toString();

		return properties;
	}
}
