import { CloseCommand } from './commands/Close';
import type { Command } from './commands/Command';
import { CurveCommand } from './commands/Curve';
import { FromCommand } from './commands/From';
import { LineCommand } from './commands/Line';
import { Drawing } from './editor/Drawing.svelte';
import { Vertex } from './editor/Vertex';
import type { CodeStyle } from './LengthPercentage';
import { distance, type Vector } from './util/vector';

export class Shape {
	fillRule?: FillRule;
	from: FromCommand;
	commands: Command[];

	constructor(from = new FromCommand(), commands: Command[] = [], fillRule?: FillRule) {
		this.from = from;
		this.commands = commands;
		this.fillRule = fillRule;
	}

	toCss(style: CodeStyle) {
		const from = this.from.toCss(style);
		const firstLine = this.fillRule ? `${this.fillRule} ${from}` : from;
		return `shape(\n\t${[firstLine, ...this.commands.map((c) => c.toCss(style))].join(',\n\t')}\n)`;
	}

	toDrawing(maxSize: Vector): Drawing {
		const vertices: Vertex[] = [];
		const lastCommand = this.commands.at(-1);
		let position = this.from.coords.toVertexPosition();
		let controlPointBackward =
			lastCommand instanceof CurveCommand ? lastCommand.withCoords2?.toVertexPosition() : undefined;

		for (const command of this.commands) {
			if (command instanceof LineCommand) {
				vertices.push(Vertex.make({ position, controlPointBackward }));
				position = command.coords.toVertexPosition();
			} else if (command instanceof CloseCommand) {
				vertices.push(Vertex.make({ position, controlPointBackward }));
				position = this.from.coords.toVertexPosition();
			} else if (command instanceof CurveCommand) {
				const controlPointForward = command.withCoords?.toVertexPosition();
				let isMirrored = false;
				if (controlPointForward && controlPointBackward) {
					const forwardMirroredVector = controlPointForward
						.toMirrored(position, maxSize)
						.toRounded()
						.toVector(maxSize);
					const backwardVector = controlPointBackward.toVector(maxSize);
					isMirrored = distance(forwardMirroredVector, backwardVector) < 1;
				}
				vertices.push(
					Vertex.make({
						position,
						controlPointForward,
						controlPointBackward,
						isMirrored
					})
				);
				position = command.coords.toVertexPosition();
				controlPointBackward = command.withCoords2?.toVertexPosition();
			} else {
				throw new Error(
					`Command type "${command.constructor.name}" not supported in Shape.toDrawing()`
				);
			}
		}

		return new Drawing(vertices);
	}
}

export type FillRule = 'nonzero' | 'evenodd';
