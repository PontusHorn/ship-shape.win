import { VertexDimension } from './VertexDimension';
import { VertexPosition } from './VertexPosition.svelte';

export type Vertex = {
	id: string;
	position: VertexPosition;
	controlPointForward?: VertexPosition;
	controlPointBackward?: VertexPosition;
	isMirrored?: boolean;
};

export function vertexFromPercent(xPercent: number, yPercent: number): Vertex {
	return {
		id: Math.random().toString(36).substring(2, 9),
		position: new VertexPosition(
			new VertexDimension('percent', xPercent),
			new VertexDimension('percent', yPercent)
		)
	};
}
