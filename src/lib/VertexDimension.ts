import { type LengthPercentage, percent, px, raw } from './LengthPercentage';

export class VertexDimension {
	type: 'percent' | 'px_from_start' | 'px_from_end';
	value: number;

	constructor(type: 'percent' | 'px_from_start' | 'px_from_end', value: number) {
		this.type = type;
		this.value = value;
	}

	get roundedValue() {
		return Math.round(this.value);
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

	toMirrored(origin: VertexDimension, maxPx: number): VertexDimension {
		const thisPx = this.toPixels(maxPx);
		const originPx = origin.toPixels(maxPx);
		const delta = thisPx - originPx;
		const mirroredPx = originPx - delta;
		return VertexDimension.fromPixels(origin.type, maxPx, mirroredPx);
	}

	static fromPixels(
		type: 'percent' | 'px_from_start' | 'px_from_end',
		maxPx: number,
		px: number
	): VertexDimension {
		switch (type) {
			case 'percent':
				return new VertexDimension(type, (px / maxPx) * 100);
			case 'px_from_start':
				return new VertexDimension(type, px);
			case 'px_from_end':
				return new VertexDimension(type, maxPx - px);
		}
	}

	toString() {
		switch (this.type) {
			case 'percent':
				return `${this.roundedValue}%`;
			case 'px_from_start':
				return `${this.value}px`;
			case 'px_from_end':
				return `calc(100% - ${this.value}px)`;
		}
	}

	toLengthPercentage(): LengthPercentage {
		switch (this.type) {
			case 'percent':
				return percent(this.roundedValue);
			case 'px_from_start':
				return px(this.value);
			case 'px_from_end':
				return raw(`calc(100% - ${this.value}px)`);
		}
	}
}
