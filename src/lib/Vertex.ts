import { randomId } from './randomId';
import { subtract, type Vector } from './vector';
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

export function moveVertex(vertex: Vertex, position: VertexPosition, maxSize: Vector): Vertex {
	const currentVector = vertex.position.toVector(maxSize);
	const newVector = position.toVector(maxSize);
	const delta = subtract(newVector, currentVector);

	// Move control points along with the vertex
	const controlPointForward = vertex.controlPointForward?.toTranslated(delta, maxSize).toRounded();
	const controlPointBackward = vertex.controlPointBackward
		?.toTranslated(delta, maxSize)
		.toRounded();

	return {
		...vertex,
		position: position.toRounded(),
		controlPointForward,
		controlPointBackward
	};
}

export function moveVertexControlPoint(
	vertex: Vertex,
	direction: 'forward' | 'backward',
	position: VertexPosition,
	maxSize: Vector
) {
	let { controlPointForward, controlPointBackward } = vertex;

	// Update the vertex's control point
	if (direction === 'forward') {
		controlPointForward = position;
	} else {
		controlPointBackward = position;
	}

	if (vertex.isMirrored) {
		const mirroredPosition = position.toMirrored(vertex.position, maxSize);

		// Update the opposite control point
		if (direction === 'forward') {
			controlPointBackward = mirroredPosition;
		} else {
			controlPointForward = mirroredPosition;
		}
	}

	return {
		...vertex,
		controlPointForward: controlPointForward?.toRounded(),
		controlPointBackward: controlPointBackward?.toRounded()
	};
}
