import type { Command } from './Command';

export class CloseCommand implements Command {
	toCss() {
		return 'close';
	}

	toSvgCommand(): string {
		return 'Z';
	}
}

export function close() {
	return new CloseCommand();
}
