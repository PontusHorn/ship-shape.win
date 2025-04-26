export class LengthPercentage {
	value: number;
	unit: LengthPercentageUnit;
	constructor(value = 0, unit: LengthPercentageUnit = 'px') {
		this.value = value;
		this.unit = unit;
	}

	toString() {
		return `${this.value}${this.unit}`;
	}
}

export type LengthPercentageUnit = 'px' | '%';

export function px(value: number) {
	return new LengthPercentage(value, 'px');
}

export function percent(value: number) {
	return new LengthPercentage(value, '%');
}
