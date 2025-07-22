import type { CodeStyle } from '$lib/LengthPercentage';
import type { CloseCommand } from './Close';
import type { LineCommand } from './Line';
import type { MoveCommand } from './Move';

export interface Command {
	toCss(style: CodeStyle): string;
	toSvgCommand(): string;
}

export type ShapeCommand = MoveCommand | LineCommand | CloseCommand;
