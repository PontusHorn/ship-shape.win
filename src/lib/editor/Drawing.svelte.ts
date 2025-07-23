import { FromCommand } from '../commands/From';
import { LineCommand } from '../commands/Line';
import { CurveCommand } from '../commands/Curve';
import { Shape } from '../Shape';
import { makeVertex, type Vertex } from './Vertex';
import { VertexPosition } from './VertexPosition';
import { subtract, type Vector } from '../util/vector';
import { UserError } from '../UserError';
import { type Curve, interpolateCurve, makeCurve } from '../util/curve';
import { assert } from '$lib/util/assert';

export class Drawing {
	#vertices: Vertex[];

	constructor(vertices: Vertex[] = []) {
		this.#vertices = $state(vertices);
	}

	get vertices(): Vertex[] {
		return this.#vertices;
	}

	*curves(maxSize: Vector): Generator<DrawingCurve> {
		for (const i of this.#vertices.keys()) {
			yield this.getCurveAt(maxSize, i);
		}
	}

	toShape(maxSize: Vector): Shape {
		const [from, ...rest] = this.#vertices;

		const commands = [...rest, from].map((vertex, index) => {
			const previousVertex = index === 0 ? from : rest[index - 1];

			const controlPoint1 = previousVertex.controlPointForward?.toCoordinatePair(maxSize);
			const controlPoint2 = vertex.controlPointBackward?.toCoordinatePair(maxSize);
			const controlPoint = controlPoint1 || controlPoint2;

			// If this segment has no control points, create a line command
			if (!controlPoint) {
				return new LineCommand(vertex.position.toCoordinatePair(maxSize));
			}

			// Otherwise, create a curve command
			if (controlPoint1 && controlPoint2) {
				// Both control points available - create a cubic curve
				return new CurveCommand(
					vertex.position.toCoordinatePair(maxSize),
					controlPoint1,
					controlPoint2
				);
			}

			// Only one control point - create a quadratic curve
			return new CurveCommand(vertex.position.toCoordinatePair(maxSize), controlPoint);
		});

		return new Shape(new FromCommand(from.position.toCoordinatePair(maxSize)), commands);
	}

	insertVertex(afterIndex: number, position: VertexPosition): string {
		const vertex = makeVertex({ position });
		this.#vertices = [
			...this.#vertices.slice(0, afterIndex + 1),
			vertex,
			...this.#vertices.slice(afterIndex + 1)
		];

		return vertex.id;
	}

	updateVertex(updatedVertex: Vertex) {
		const index = this.#vertices.findIndex(({ id }) => id === updatedVertex.id);
		assert(index !== -1, 'Vertex not found');
		this.#vertices[index] = updatedVertex;
	}

	getCurveAt(maxSize: Vector, i: number): DrawingCurve {
		const from = this.#vertices[i];
		const to = this.#vertices[(i + 1) % this.#vertices.length];

		// Get points and control points for this curve segment
		const fromVector = from.position.toVector(maxSize);
		const toVector = to.position.toVector(maxSize);
		const controlPoint1 = from.controlPointForward?.toVector(maxSize);
		const controlPoint2 = to.controlPointBackward?.toVector(maxSize);

		return {
			id: `${from.id}-${to.id}`,
			curve: makeCurve(fromVector, toVector, controlPoint1, controlPoint2),
			from: from,
			to: to
		};
	}

	getMidpointAt(maxSize: Vector, i: number): VertexPosition {
		const { curve, from } = this.getCurveAt(maxSize, i);

		// Interpolate the midpoint of the curve segment
		const midpoint = interpolateCurve(curve, 0.5);
		return from.position.withVector(midpoint, maxSize);
	}

	getTangentialPositionAt(maxSize: Vector, distance: number, i: number): VertexPosition {
		const previous = this.#vertices.at(i - 1);
		const current = this.#vertices.at(i);
		const next = this.#vertices.at((i + 1) % this.#vertices.length);
		if (!previous || !current || !next) {
			throw new Error('Invalid vertex index');
		}

		const [dx, dy] = subtract(next.position.toVector(maxSize), previous.position.toVector(maxSize));
		const angle = Math.atan2(dy, dx);
		return current.position.toTranslated(
			[Math.cos(angle) * distance, Math.sin(angle) * distance],
			maxSize
		);
	}

	canDeleteVertex(id: string): boolean {
		const vertexExists = this.#vertices.some((vertex) => vertex.id === id);
		return vertexExists && this.#vertices.length > 3;
	}

	deleteVertex(id: string): void {
		if (!this.canDeleteVertex(id)) {
			const vertexExists = this.#vertices.some((vertex) => vertex.id === id);
			if (!vertexExists) {
				throw new Error(`Vertex with id "${id}" not found`);
			}
			throw new UserError("Can't delete. The shape must have at least 3 vertices.");
		}

		const index = this.#vertices.findIndex((vertex) => vertex.id === id);
		this.#vertices.splice(index, 1);
	}

	canDeleteControlPoint(id: string, direction: 'forward' | 'backward'): boolean {
		const vertex = this.#vertices.find((vertex) => vertex.id === id);
		if (!vertex) return false;

		const controlPoint =
			direction === 'forward' ? vertex.controlPointForward : vertex.controlPointBackward;

		return !!controlPoint;
	}

	deleteControlPoint(id: string, direction: 'forward' | 'backward'): void {
		if (!this.canDeleteControlPoint(id, direction)) {
			const vertex = this.#vertices.find((vertex) => vertex.id === id);
			if (!vertex) {
				throw new Error(`Vertex with id "${id}" not found`);
			}
			throw new Error(`No ${direction} control point to delete.`);
		}

		const index = this.#vertices.findIndex((vertex) => vertex.id === id);
		const vertex = this.#vertices[index];

		// Create new vertex with the specified control point removed and mirroring broken
		const field = direction === 'forward' ? 'controlPointForward' : 'controlPointBackward';
		this.#vertices[index] = { ...vertex, isMirrored: false, [field]: undefined };
	}
}

type DrawingCurve = {
	id: string;
	curve: Curve;
	from: Vertex;
	to: Vertex;
};
