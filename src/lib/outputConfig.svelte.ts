import type { CodeStyle } from './LengthPercentage';
import type { ShapeProperty } from './util/output';
import type { Vector } from './util/vector';

export type OutputConfig = {
	shapeProperty: ShapeProperty;
	codeStyle: CodeStyle;
	previewSize: Vector;
};

export const outputConfig = $state<OutputConfig>({
	shapeProperty: 'clip-path',
	codeStyle: 'default',
	previewSize: [300, 300]
});
