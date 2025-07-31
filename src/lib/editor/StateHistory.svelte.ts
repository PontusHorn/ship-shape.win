export class StateHistory<State> {
	#_currentState: State;
	#undoStack: Change<State>[];
	#redoStack: Change<State>[];
	#listeners: Set<(state: State) => void>;

	constructor(initialState: State) {
		this.#_currentState = initialState;
		this.#undoStack = $state([]);
		this.#redoStack = $state([]);
		this.#listeners = new Set();
	}

	subscribe(callback: (state: State) => void): () => void {
		this.#listeners.add(callback);
		return () => {
			this.#listeners.delete(callback);
		};
	}

	get #currentState(): State {
		return this.#_currentState;
	}

	set #currentState(newState: State) {
		this.#_currentState = newState;
		this.#listeners.forEach((callback) => callback(this.#_currentState));
	}

	get undoStack(): Change<State>[] {
		return this.#undoStack;
	}

	get redoStack(): Change<State>[] {
		return this.#redoStack;
	}

	recordChange(description: string, newState: State): void {
		this.#undoStack.push({
			timestamp: Date.now(),
			description,
			state: structuredClone(this.#currentState)
		});
		this.#currentState = newState;
		this.#redoStack = []; // Clear redo stack on new change
	}

	undo(): void {
		const lastChange = this.#undoStack.pop();
		if (!lastChange) return;
		this.#redoStack.push({
			...lastChange,
			state: structuredClone(this.#currentState)
		});
		this.#currentState = structuredClone($state.snapshot(lastChange.state) as State);
		console.log('undid', this.#redoStack.length);
	}

	redo(): void {
		const nextChange = this.#redoStack.pop();
		if (!nextChange) return;
		this.#undoStack.push({
			...nextChange,
			state: structuredClone(this.#currentState)
		});
		this.#currentState = structuredClone($state.snapshot(nextChange.state) as State);
	}
}

export type Change<State> = {
	timestamp: number;
	description: string;

	/**
	 * The state at the time of this change (before applying the change)
	 */
	state: State;
};
