import type { CssProperties } from './css';
import type { CodeStyle } from '../LengthPercentage';
import type { Shape } from '../Shape';

export const OFFSET_PATH_KEYFRAMES = `

@keyframes followPath {
	from {
		offset-distance: 0%;
	}
	to {
		offset-distance: 100%;
	}
}`;

export type ShapeProperty = 'clip-path' | 'offset-path';

export function getShapeCssProperties(
	shape: Shape,
	property: ShapeProperty,
	style: CodeStyle
): CssProperties {
	return property === 'clip-path'
		? getClipPathCssProperties(shape, style)
		: getOffsetPathCssProperties(shape, style);
}

export function getClipPathCssProperties(shape: Shape, style: CodeStyle): CssProperties {
	return { 'clip-path': shape.toCss(style) };
}

export function getOffsetPathCssProperties(shape: Shape, style: CodeStyle): CssProperties {
	return {
		'offset-path': shape.toCss(style),
		animation: 'followPath 5s linear infinite'
	};
}

export function getShapeExtraCss(property: ShapeProperty): string {
	return property === 'clip-path' ? '' : OFFSET_PATH_KEYFRAMES;
}

export function getSvgPath(shape: Shape) {
	const commands = [
		shape.from.toSvgCommand(),
		...shape.commands.map((command) => command.toSvgCommand())
	];

	return commands.join(' ');
}
