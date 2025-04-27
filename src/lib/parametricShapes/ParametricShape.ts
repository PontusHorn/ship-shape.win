import type { Shape } from '$lib/Shape';

export interface ParametricShape {
	toShape(): Shape;
}
