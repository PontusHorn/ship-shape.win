import { randomId } from '../util/randomId';
import { subtract, type Vector } from '../util/vector';
import { VertexDimension } from './VertexDimension';
import { VertexPosition } from './VertexPosition';

export class Vertex {
	id: string;
	position: VertexPosition;
	controlPointForward?: VertexPosition;
	controlPointBackward?: VertexPosition;
	isMirrored?: boolean;

	constructor(
		id: string,
		position: VertexPosition,
		controlPointForward?: VertexPosition,
		controlPointBackward?: VertexPosition,
		isMirrored?: boolean
	) {
		this.id = id;
		this.position = position;
		this.controlPointForward = controlPointForward;
		this.controlPointBackward = controlPointBackward;
		this.isMirrored = isMirrored;
	}

	static fromPercent(xPercent: number, yPercent: number): Vertex {
		return Vertex.make({
			position: new VertexPosition(
				new VertexDimension('percent', xPercent),
				new VertexDimension('percent', yPercent)
			)
		});
	}

	static make(
		vertex: Pick<Vertex, 'position'> &
			Partial<Pick<Vertex, 'id' | 'controlPointForward' | 'controlPointBackward' | 'isMirrored'>>
	): Vertex {
		return new Vertex(
			vertex.id ?? randomId(),
			vertex.position,
			vertex.controlPointForward,
			vertex.controlPointBackward,
			vertex.isMirrored
		);
	}

	withPosition(position: VertexPosition, maxSize: Vector): Vertex {
		const currentVector = this.position.toVector(maxSize);
		const newVector = position.toVector(maxSize);
		const delta = subtract(newVector, currentVector);

		// Move control points along with the vertex
		const controlPointForward = this.controlPointForward?.toTranslated(delta, maxSize).toRounded();
		const controlPointBackward = this.controlPointBackward
			?.toTranslated(delta, maxSize)
			.toRounded();

		return Vertex.make({
			...this,
			position: position.toRounded(),
			controlPointForward,
			controlPointBackward
		});
	}

	withControlPoint(direction: 'forward' | 'backward', position: VertexPosition, maxSize: Vector) {
		let { controlPointForward, controlPointBackward } = this;

		// Update the vertex's control point
		if (direction === 'forward') {
			controlPointForward = position;
		} else {
			controlPointBackward = position;
		}

		if (this.isMirrored) {
			const mirroredPosition = position.toMirrored(this.position, maxSize);

			// Update the opposite control point
			if (direction === 'forward') {
				controlPointBackward = mirroredPosition;
			} else {
				controlPointForward = mirroredPosition;
			}
		}

		return Vertex.make({
			...this,
			controlPointForward: controlPointForward?.toRounded(),
			controlPointBackward: controlPointBackward?.toRounded()
		});
	}
}
