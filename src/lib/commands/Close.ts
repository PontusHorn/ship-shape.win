import type { Command } from './Command';

export class Close implements Command {
	toString() {
		return 'close';
	}
}

export function close() {
	return new Close();
}
