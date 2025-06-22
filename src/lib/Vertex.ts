import { randomId } from './randomId';
import { VertexDimension } from './VertexDimension';
import { VertexPosition } from './VertexPosition';

export type Vertex = {
	id: string;
	position: VertexPosition;
	controlPointForward?: VertexPosition;
	controlPointBackward?: VertexPosition;
	isMirrored?: boolean;
};

export function vertexFromPercent(xPercent: number, yPercent: number): Vertex {
	return makeVertex({
		position: new VertexPosition(
			new VertexDimension('percent', xPercent),
			new VertexDimension('percent', yPercent)
		)
	});
}

export function makeVertex(vertex: Omit<Vertex, 'id'>): Vertex {
	return { id: randomId(), ...vertex };
}
