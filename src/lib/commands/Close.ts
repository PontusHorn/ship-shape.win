import type { Command } from './Command';

export class Close implements Command {
	toString() {
		return 'close';
	}

	toSvgCommand(): string {
		return 'Z';
	}
}

export function close() {
	return new Close();
}
