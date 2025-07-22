import type { Command } from './commands/Command';
import { FromCommand } from './commands/From';
import type { CodeStyle } from './LengthPercentage';

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
}

export type FillRule = 'nonzero' | 'evenodd';
