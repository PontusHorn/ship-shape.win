import type { Command } from './commands/Command';
import { From } from './commands/From';

export class Shape {
	fillRule?: FillRule;
	from: From;
	commands: Command[];

	constructor(from = new From(), commands: Command[] = [], fillRule?: FillRule) {
		this.from = from;
		this.commands = commands;
		this.fillRule = fillRule;
	}

	toString() {
		const initialCommand = this.fillRule ? `${this.fillRule} ${this.from}` : this.from;
		return `shape(\n\t${[initialCommand, ...this.commands].join(',\n\t')}\n)`;
	}
}

export type FillRule = 'nonzero' | 'evenodd';
