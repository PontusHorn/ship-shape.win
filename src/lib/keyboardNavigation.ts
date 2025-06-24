import type { Vector } from './types';

export function getArrowKeyDelta(
	event: KeyboardEvent,
	{ step = 10, shiftStep = 30, ctrlStep = 1 } = {}
): Vector | undefined {
	let moveStep = step;
	if (event.shiftKey) moveStep = shiftStep;
	if (event.ctrlKey) moveStep = ctrlStep;

	let deltaX = 0;
	let deltaY = 0;

	switch (event.key) {
		case 'ArrowLeft':
			deltaX = -moveStep;
			break;
		case 'ArrowRight':
			deltaX = moveStep;
			break;
		case 'ArrowUp':
			deltaY = -moveStep;
			break;
		case 'ArrowDown':
			deltaY = moveStep;
			break;
		default:
			return;
	}

	return [deltaX, deltaY];
}
