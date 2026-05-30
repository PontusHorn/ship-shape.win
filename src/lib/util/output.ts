import type { CssDeclarationBlock } from './css';
import type { CodeStyle } from '../LengthPercentage';
import type { Shape } from '../Shape';

export type ShapeProperty = 'clip-path' | 'offset-path' | 'border-shape';

export function getShapeCssDeclarationBlock(
	shape: Shape,
	property: ShapeProperty,
	style: CodeStyle,
	customProperties?: CssDeclarationBlock
): CssDeclarationBlock {
	switch (property) {
		case 'clip-path':
			return getClipPathCssDeclarationBlock(shape, style, customProperties);
		case 'offset-path':
			return getOffsetPathCssDeclarationBlock(shape, style, customProperties);
		case 'border-shape':
			return getBorderShapeCssDeclarationBlock(shape, style, customProperties);
	}
}

export const CLIPPED_SHAPE_CLASS_NAME = 'clippedShape';
export function getClipPathCssDeclarationBlock(
	shape: Shape,
	style: CodeStyle,
	customProperties: CssDeclarationBlock = []
): CssDeclarationBlock {
	return [
		{
			type: 'statement',
			value: `.${CLIPPED_SHAPE_CLASS_NAME}`,
			block: [
				...customProperties,
				{ type: 'property', key: 'clip-path', value: shape.toCss(style) }
			]
		}
	];
}

export const PATH_FOLLOWER_CLASS_NAME = 'pathFollower';
export function getOffsetPathCssDeclarationBlock(
	shape: Shape,
	style: CodeStyle,
	customProperties: CssDeclarationBlock = []
): CssDeclarationBlock {
	return [
		{
			type: 'statement',
			value: `.${PATH_FOLLOWER_CLASS_NAME}`,
			block: [
				...customProperties,
				{ type: 'property', key: 'offset-path', value: shape.toCss(style) },
				{ type: 'property', key: 'animation', value: 'followPath 5s linear infinite' }
			]
		},
		{ type: 'blank-line' },
		{
			type: 'statement',
			value: '@keyframes followPath',
			block: [
				{
					type: 'statement',
					value: 'from',
					block: [{ type: 'property', key: 'offset-distance', value: '0%' }]
				},
				{
					type: 'statement',
					value: 'to',
					block: [{ type: 'property', key: 'offset-distance', value: '100%' }]
				}
			]
		}
	];
}

export const BORDERED_SHAPE_CLASS_NAME = 'borderedShape';
export function getBorderShapeCssDeclarationBlock(
	shape: Shape,
	style: CodeStyle,
	customProperties: CssDeclarationBlock = []
): CssDeclarationBlock {
	const css = shape.toCss(style);
	return [
		{
			type: 'statement',
			value: `.${BORDERED_SHAPE_CLASS_NAME}`,
			block: [
				...customProperties,
				{ type: 'property', key: 'border-shape', value: css },
				{ type: 'blank-line' },
				{ type: 'comment', value: 'Fallback (optional, will cut off borders)' },
				{
					type: 'statement',
					value: '@supports not (border-shape: circle(50%))',
					block: [{ type: 'property', key: 'clip-path', value: css }]
				}
			]
		}
	];
}

export function getSvgPath(shape: Shape) {
	const commands = [
		shape.from.toSvgCommand(),
		...shape.commands.map((command) => command.toSvgCommand())
	];

	return commands.join(' ');
}
