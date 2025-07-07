import type { Close } from './Close';
import type { Line } from './Line';
import type { Move } from './Move';

export interface Command {
	toString(): string;
	toSvgCommand(): string;
}

export type ShapeCommand = Move | Line | Close;
