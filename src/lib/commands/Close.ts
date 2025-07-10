import type { Command } from './Command';

export class Close implements Command {
	toCss() {
		return 'close';
	}

	toSvgCommand(): string {
		return 'Z';
	}
}

export function close() {
	return new Close();
}
