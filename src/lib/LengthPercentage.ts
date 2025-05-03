export class LengthPercentage<Value = unknown> {
	value: Value;

	constructor(value: Value) {
		this.value = value;
	}
}

export class Px extends LengthPercentage<number> {
	toString() {
		return `${this.value}px`;
	}
}

export function px(value: number) {
	return new Px(value);
}

export class Percent extends LengthPercentage<number> {
	toString() {
		return `${this.value}%`;
	}
}

export function percent(value: number) {
	return new Percent(value);
}

export class Raw extends LengthPercentage<string> {
	toString() {
		return this.value;
	}
}

export function raw(value: string) {
	return new Raw(value);
}
