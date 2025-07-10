import type { CssProperties } from '$lib/css';
import type { OutputConfig } from '$lib/outputConfig.svelte';
import type { Shape } from '$lib/Shape';
import type { Vector } from '$lib/vector';

export interface ParametricShape {
	toShape(maxSize: Vector): Shape;
	toCssProperties(outputConfig: OutputConfig): CssProperties;
}
