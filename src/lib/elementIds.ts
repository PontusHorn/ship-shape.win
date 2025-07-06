export function createVertexButtonId(vertexId: string): string {
	return `vertex-${vertexId}-button`;
}

export function getVertexButton(vertexId: string): HTMLElement | null {
	return document.getElementById(createVertexButtonId(vertexId));
}

export function createControlPointButtonId(
	vertexId: string,
	direction: 'forward' | 'backward'
): string {
	return `vertex-${vertexId}-${direction}-button`;
}

export function getControlPointButton(
	vertexId: string,
	direction: 'forward' | 'backward'
): HTMLElement | null {
	return document.getElementById(createControlPointButtonId(vertexId, direction));
}
