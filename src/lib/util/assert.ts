/**
 * Asserts that a value is truthy.
 */
export function assert(value: unknown, message: string): asserts value {
	if (!value) {
		throw new Error(message);
	}
}

/**
 * Asserts that a value is not null or undefined and returns it with a narrowed
 * return type.
 */
export function nonNullish<Value>(value: Value | null | undefined, message: string): Value {
	if (value === null || value === undefined) {
		throw new Error(message);
	}

	return value;
}

/**
 * Asserts that a value is never reached. This can be used to ensure that all
 * possible cases are handled, for example in a switch statement.
 */
export function assertNever(value: never): never {
	throw new Error(`Unexpected value: ${value}`);
}
