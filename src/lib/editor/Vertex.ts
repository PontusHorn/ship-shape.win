import { assert } from '$lib/util/assert';
import { randomId } from '../util/randomId';
import { subtract, type Vector } from '../util/vector';
import type { VertexPart } from './Editor.svelte';
import { VertexDimension, type DimensionType } from './VertexDimension';
import { VertexPosition, type SerializedVertexPosition } from './VertexPosition';

export class Vertex {
	id: string;
	position: VertexPosition;
	controlPointForward?: VertexPosition;
	controlPointBackward?: VertexPosition;
	isMirrored: boolean;

	constructor(
		id: string,
		position: VertexPosition,
		controlPointForward?: VertexPosition,
		controlPointBackward?: VertexPosition,
		isMirrored = false
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

	withDimensionValue(part: VertexPart, dimension: 'x' | 'y', value: number, maxSize: Vector) {
		const position = this[part];
		assert(position, `Position "${part}" not found in vertex`);

		const { x, y } = position;
		const newPosition =
			dimension === 'x' ? position.withX(x.withValue(value)) : position.withY(y.withValue(value));

		switch (part) {
			case 'position':
				return this.withPosition(newPosition, maxSize);
			case 'controlPointForward':
				return this.withControlPoint('forward', newPosition, maxSize);
			case 'controlPointBackward':
				return this.withControlPoint('backward', newPosition, maxSize);
		}
	}

	withConvertedDimensionType(
		part: VertexPart,
		dimension: 'x' | 'y',
		newType: DimensionType,
		maxSize: Vector
	): Vertex {
		const position = this[part];
		assert(position, `Position "${part}" not found in vertex`);

		const newPosition = position.withConvertedDimensionType(dimension, newType, maxSize);
		switch (part) {
			case 'position':
				return this.withPosition(newPosition, maxSize);
			case 'controlPointForward':
				return this.withControlPoint('forward', newPosition, maxSize);
			case 'controlPointBackward':
				return this.withControlPoint('backward', newPosition, maxSize);
		}
	}

	withMirrored(isMirrored: boolean, maxSize: Vector): Vertex {
		const newVertex = Vertex.make({ ...this, isMirrored });

		// If we turn on mirroring, we need to update the control points to be
		// mirrored as well
		if (isMirrored && this.controlPointForward) {
			newVertex.controlPointBackward = this.controlPointForward
				.toMirrored(this.position, maxSize)
				.toRounded();
		} else if (isMirrored && this.controlPointBackward) {
			newVertex.controlPointForward = this.controlPointBackward
				.toMirrored(this.position, maxSize)
				.toRounded();
		}

		return newVertex;
	}

	serialize(): SerializedVertex {
		return {
			type: 'Vertex',
			id: this.id,
			position: this.position.serialize(),
			controlPointForward: this.controlPointForward?.serialize(),
			controlPointBackward: this.controlPointBackward?.serialize(),
			isMirrored: this.isMirrored
		};
	}

	static fromSerialized(data: SerializedVertex): Vertex {
		return new Vertex(
			data.id,
			VertexPosition.fromSerialized(data.position),
			data.controlPointForward && VertexPosition.fromSerialized(data.controlPointForward),
			data.controlPointBackward && VertexPosition.fromSerialized(data.controlPointBackward),
			data.isMirrored
		);
	}
}

export type SerializedVertex = {
	type: 'Vertex';
	id: string;
	position: SerializedVertexPosition;
	controlPointForward?: SerializedVertexPosition;
	controlPointBackward?: SerializedVertexPosition;
	isMirrored: boolean;
};
