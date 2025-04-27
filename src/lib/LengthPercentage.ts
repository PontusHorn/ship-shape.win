export interface LengthPercentage {
	toString(): string;
}

export class Px {
	value: number;

	constructor(value = 0) {
		this.value = value;
	}

	toString() {
		return `${this.value}px`;
	}
}

export function px(value: number) {
	return new Px(value);
}

export class Percent {
	value: number;

	constructor(value = 0) {
		this.value = value;
	}

	toString() {
		return `${this.value}%`;
	}
}

export function percent(value: number) {
	return new Percent(value);
}

export class Raw {
	value: string;

	constructor(value: string) {
		this.value = value;
	}

	toString() {
		return this.value;
	}
}

export function raw(value: string) {
	return new Raw(value);
}
