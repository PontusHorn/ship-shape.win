import { type CodeStyle, type LengthPercentage, percent, px, raw } from '../LengthPercentage';

export type DimensionType = 'percent' | 'px_from_start' | 'px_from_end';

export class VertexDimension {
	type: DimensionType;
	value: number;

	constructor(type: DimensionType, value: number) {
		this.type = type;
		this.value = value;
	}

	get roundedValue() {
		return Math.round(this.value);
	}

	withValue(value: number): VertexDimension {
		return new VertexDimension(this.type, value);
	}

	withConvertedType(newType: DimensionType, maxPx: number): VertexDimension {
		// Convert current value to pixels, then to new type
		const currentPixels = this.toPixels(maxPx);
		return VertexDimension.fromPixels(newType, maxPx, currentPixels);
	}

	toPixels(maxPx: number): number {
		switch (this.type) {
			case 'percent':
				return Math.round((this.value / 100) * maxPx);
			case 'px_from_start':
				return this.value;
			case 'px_from_end':
				return maxPx - this.value;
		}
	}

	toRounded(): VertexDimension {
		const percentPrecision = 10;
		return this.type === 'percent'
			? this.withValue(Math.round(this.value * percentPrecision) / percentPrecision)
			: this.withValue(Math.round(this.value));
	}

	toTranslated(deltaPx: number, maxPx: number): VertexDimension {
		const newPx = this.toPixels(maxPx) + deltaPx;
		return VertexDimension.fromPixels(this.type, maxPx, newPx);
	}

	toMirrored(origin: VertexDimension, maxPx: number): VertexDimension {
		const thisPx = this.toPixels(maxPx);
		const originPx = origin.toPixels(maxPx);
		const delta = thisPx - originPx;
		const mirroredPx = originPx - delta;
		return VertexDimension.fromPixels(this.type, maxPx, mirroredPx);
	}

	static fromPixels(type: DimensionType, maxPx: number, px: number): VertexDimension {
		switch (type) {
			case 'percent':
				return new VertexDimension(type, (px / maxPx) * 100);
			case 'px_from_start':
				return new VertexDimension(type, px);
			case 'px_from_end':
				return new VertexDimension(type, maxPx - px);
		}
	}

	toCss(maxPx: number, style: CodeStyle = 'default'): string {
		return this.toLengthPercentage(maxPx).toCss(style);
	}

	toLengthPercentage(maxPx: number): LengthPercentage {
		switch (this.type) {
			case 'percent':
				return percent(this.roundedValue);
			case 'px_from_start':
				return px(this.value);
			case 'px_from_end':
				return raw(`calc(100% - ${this.value}px)`, px(maxPx - this.value));
		}
	}
}

export function isDimensionType(value: string): value is DimensionType {
	return ['percent', 'px_from_start', 'px_from_end'].includes(value);
}
