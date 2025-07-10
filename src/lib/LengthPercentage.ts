export type CodeStyle = 'default' | 'minimal';

export interface LengthPercentage {
	toCss(style: CodeStyle): string;
	toSvg(): string;
}

export type BaseUnit = 'px' | 'percent';

export class Px implements LengthPercentage {
	value: number;

	constructor(value: number) {
		this.value = value;
	}

	toCss() {
		return `${Math.round(this.value)}px`;
	}

	toSvg() {
		return this.value.toString();
	}
}

export function px(value: number) {
	return new Px(value);
}

export class Percent implements LengthPercentage {
	value: number;

	constructor(value: number) {
		this.value = value;
	}

	toCss() {
		return `${Math.round(this.value * 10) / 10}%`;
	}

	toSvg() {
		// This operates on the assumption that the svg viewbox is "0 0 100 100"
		return this.value.toString();
	}
}

export function percent(value: number) {
	return new Percent(value);
}

export class Raw implements LengthPercentage {
	cssValue: string;
	calculatedValue: Px | Percent;

	constructor(cssValue: string, calculatedValue: Px | Percent) {
		this.cssValue = cssValue;
		this.calculatedValue = calculatedValue;
	}

	toCss(mode = 'default') {
		switch (mode) {
			case 'default':
				return this.cssValue;
			case 'minimal':
				return this.calculatedValue.toCss();
			default:
				throw new Error(`Invalid mode: ${mode}`);
		}
	}

	toSvg(): string {
		return this.calculatedValue.toSvg();
	}
}

export function raw(cssValue: string, calculatedValue: Px | Percent) {
	return new Raw(cssValue, calculatedValue);
}
