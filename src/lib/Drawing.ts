import { From } from './commands/From';
import { Line } from './commands/Line';
import { Shape } from './Shape';
import type { Vertex } from './Vertex';

export class Drawing {
	vertices: Vertex[];

	constructor(vertices: Vertex[] = []) {
		this.vertices = vertices;
	}

	toShape(): Shape {
		const [from, ...rest] = this.vertices;
		return new Shape(
			new From(from.position),
			rest.map((vertex) => new Line(vertex.position))
		);
	}
}
