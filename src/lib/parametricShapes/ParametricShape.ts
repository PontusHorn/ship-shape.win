import type { CssDeclarationBlock } from '$lib/util/css';
import type { OutputConfig } from '$lib/outputConfig.svelte';
import type { Shape } from '$lib/Shape';
import type { Vector } from '$lib/util/vector';

export interface ParametricShape {
	toShape(maxSize: Vector): Shape;
	toCssDeclarationBlock(outputConfig: OutputConfig): CssDeclarationBlock;
}
