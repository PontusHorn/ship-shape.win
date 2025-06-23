import { From } from './commands/From';
import { Line } from './commands/Line';
import { Curve } from './commands/Curve';
import { Shape } from './Shape';
import { makeVertex, type Vertex } from './Vertex';
import { VertexDimension } from './VertexDimension';
import { VertexPosition } from './VertexPosition';

export class Drawing {
	vertices: Vertex[];

	constructor(vertices: Vertex[] = []) {
		this.vertices = $state(vertices);
	}

	*curves() {
		for (const [i, vertex] of this.vertices.entries()) {
			const nextVertex = this.vertices[(i + 1) % this.vertices.length];
			yield [vertex, nextVertex];
		}
	}

	toShape(): Shape {
		const [from, ...rest] = this.vertices;

		const commands = [...rest, from].map((vertex, index) => {
			const previousVertex = index === 0 ? from : rest[index - 1];

			const controlPoint1 = previousVertex.controlPointForward?.toPosition();
			const controlPoint2 = vertex.controlPointBackward?.toPosition();
			const controlPoint = controlPoint1 || controlPoint2;

			// If this segment has no control points, create a line command
			if (!controlPoint) {
				return new Line(vertex.position.toPosition());
			}

			// Otherwise, create a curve command
			if (controlPoint1 && controlPoint2) {
				// Both control points available - create a cubic curve
				return new Curve(vertex.position.toPosition(), controlPoint1, controlPoint2);
			}

			// Only one control point - create a quadratic curve
			return new Curve(vertex.position.toPosition(), controlPoint);
		});

		return new Shape(new From(from.position.toPosition()), commands);
	}

	insertVertex(afterIndex: number, position: VertexPosition): string {
		const vertex = makeVertex({ position });
		this.vertices = [
			...this.vertices.slice(0, afterIndex + 1),
			vertex,
			...this.vertices.slice(afterIndex + 1)
		];

		return vertex.id;
	}

	getMidpointAt(maxWidth: number, maxHeight: number, i: number): VertexPosition {
		const from = this.vertices[i];
		const to = this.vertices[(i + 1) % this.vertices.length];
		const xPx = (from.position.x.toPixels(maxWidth) + to.position.x.toPixels(maxWidth)) / 2;
		const yPx = (from.position.y.toPixels(maxHeight) + to.position.y.toPixels(maxHeight)) / 2;
		const x = VertexDimension.fromPixels(from.position.x.type, maxWidth, xPx);
		const y = VertexDimension.fromPixels(from.position.y.type, maxHeight, yPx);
		return new VertexPosition(x, y);
	}

	getTangentialPositionAt(
		maxWidth: number,
		maxHeight: number,
		distance: number,
		i: number
	): VertexPosition {
		const previous = this.vertices.at(i - 1);
		const current = this.vertices.at(i);
		const next = this.vertices.at((i + 1) % this.vertices.length);
		if (!previous || !current || !next) {
			throw new Error('Invalid vertex index');
		}

		const dx = next.position.x.toPixels(maxWidth) - previous.position.x.toPixels(maxWidth);
		const dy = next.position.y.toPixels(maxHeight) - previous.position.y.toPixels(maxHeight);
		const angle = Math.atan2(dy, dx);
		const x = VertexDimension.fromPixels(
			current.position.x.type,
			maxWidth,
			current.position.x.toPixels(maxWidth) + Math.cos(angle) * distance
		);
		const y = VertexDimension.fromPixels(
			current.position.y.type,
			maxHeight,
			current.position.y.toPixels(maxHeight) + Math.sin(angle) * distance
		);

		return new VertexPosition(x, y);
	}
}
