import { CoordinatePair } from '$lib/CoordinatePair';
import type { CodeStyle, LengthPercentage } from '$lib/LengthPercentage';
import type { Command } from './Command';
import type { MoveMethod } from './shared';

export class Curve implements Command {
	method: MoveMethod;
	coords: CoordinatePair;
	withCoords: CoordinatePair;
	withCoords2?: CoordinatePair;

	constructor(
		coords: CoordinatePair,
		withCoords: CoordinatePair,
		withCoords2?: CoordinatePair,
		method: MoveMethod = 'to'
	) {
		this.coords = coords;
		this.withCoords = withCoords;
		this.withCoords2 = withCoords2;
		this.method = method;
	}

	toCss(style: CodeStyle) {
		const parts = [
			[`curve ${this.method}`],
			[this.coords.x.toCss(style), this.coords.y.toCss(style)],
			['with', this.withCoords.x.toCss(style), this.withCoords.y.toCss(style)]
		];

		if (this.withCoords2) {
			parts.push(['/', this.withCoords2.x.toCss(style), this.withCoords2.y.toCss(style)]);
		}

		const oneLiner = parts.flat().join(' ');
		if (oneLiner.length <= 80) {
			return oneLiner;
		}

		const wrappedParts = parts.map((chunk) => {
			const oneLineChunk = chunk.join(' ');
			if (oneLineChunk.length <= 80) {
				return oneLineChunk;
			}

			return chunk.length >= 3 ? chunk.join('\n\t\t\t') : chunk.join('\n\t\t');
		});

		return wrappedParts.join('\n\t\t');
	}

	toSvgCommand(): string {
		if (this.withCoords2) {
			return `C ${this.withCoords.toSvgPoint()} ${this.withCoords2.toSvgPoint()} ${this.coords.toSvgPoint()}`;
		} else {
			return `Q ${this.withCoords.toSvgPoint()} ${this.coords.toSvgPoint()}`;
		}
	}
}

export function curveBy(
	coords: [LengthPercentage, LengthPercentage],
	controlPoint1: [LengthPercentage, LengthPercentage],
	controlPoint2?: [LengthPercentage, LengthPercentage]
) {
	return new Curve(
		new CoordinatePair(...coords),
		new CoordinatePair(...controlPoint1),
		controlPoint2 ? new CoordinatePair(...controlPoint2) : undefined,
		'by'
	);
}

export function curveTo(
	coords: [LengthPercentage, LengthPercentage],
	controlPoint1: [LengthPercentage, LengthPercentage],
	controlPoint2?: [LengthPercentage, LengthPercentage]
) {
	return new Curve(
		new CoordinatePair(...coords),
		new CoordinatePair(...controlPoint1),
		controlPoint2 ? new CoordinatePair(...controlPoint2) : undefined,
		'to'
	);
}
