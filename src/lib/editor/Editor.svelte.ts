import { outputConfig } from '$lib/outputConfig.svelte';
import { getShapeCssProperties } from '$lib/util/output';
import { Drawing, type SerializedDrawing } from './Drawing.svelte';
import { StateHistory } from './StateHistory.svelte';
import { Vertex } from './Vertex';
import type { VertexPosition } from './VertexPosition';

export class Editor {
	#tool: ToolType;
	#drawing: Drawing;
	#selection: SelectedVertex | undefined;

	/**
	 * Version of the editor state, used to track changes for history.
	 * Incremented whenever the state changes.
	 */
	#stateVersion: number;
	#history: StateHistory<SerializedEditor>;

	constructor(
		tool: ToolType = 'select',
		drawing = makeDefaultDrawing(),
		selection?: SelectedVertex,
		stateVersion = 0
	) {
		this.#tool = $state(tool);
		this.#drawing = $state(drawing);
		this.#selection = $state(selection);

		this.#stateVersion = stateVersion;
		this.#history = new StateHistory(this.serialize());
		this.#history.subscribe((state) => {
			if (state.stateVersion === this.#stateVersion) return;
			this.#tool = state.tool;
			this.#drawing = Drawing.fromSerialized(state.drawing);
			this.#selection = state.selection;
			this.#stateVersion = state.stateVersion;
		});
	}

	get tool(): ToolType {
		return this.#tool;
	}
	set tool(tool: ToolType) {
		// Don't allow toggling the tool off - we want a tool to always be selected,
		// but the `ToggleGroup` component does not support this behaviour natively.
		if (!tool) return;
		this.#tool = tool;
	}

	get drawing(): Drawing {
		return this.#drawing;
	}
	set drawing(drawing: Drawing) {
		this.#drawing = drawing;
		this.#selection = undefined; // Clear selection when changing drawing
	}

	get selection(): SelectedVertex | undefined {
		return this.#selection;
	}
	set selection(selection: SelectedVertex | undefined) {
		this.#selection = selection;
	}

	#selectedVertex = $derived.by(() => {
		const { selection, drawing } = editor;
		if (!selection) return;

		const selectedVertex = drawing.vertices.find((v) => v.id === selection.id);
		if (!selectedVertex) throw new Error('Selected vertex not found');

		return selectedVertex;
	});
	get selectedVertex(): Vertex | undefined {
		return this.#selectedVertex;
	}

	#selectedVertexPosition = $derived.by(() => {
		const { selection } = editor;
		if (!selection || !this.#selectedVertex) return;

		const position = this.#selectedVertex[selection.part];
		if (!position) throw new Error(`Position "${selection.part}" not found in vertex`);

		return position;
	});
	get selectedVertexPosition(): VertexPosition | undefined {
		return this.#selectedVertexPosition;
	}

	#shape = $derived(editor.drawing.toShape(outputConfig.previewSize));
	get drawingShape() {
		return this.#shape;
	}

	#cssProperties = $derived(
		getShapeCssProperties(this.#shape, outputConfig.shapeProperty, outputConfig.codeStyle)
	);
	get drawingCssProperties() {
		return this.#cssProperties;
	}

	recordChange(description: string): void {
		this.#stateVersion++;
		this.#history.recordChange(description, this.serialize());
	}

	get history(): StateHistory<SerializedEditor> {
		return this.#history;
	}

	serialize(): SerializedEditor {
		return {
			type: 'Editor',
			tool: this.tool,
			drawing: this.drawing.serialize(),
			selection: this.selection ? { id: this.selection.id, part: this.selection.part } : undefined,
			stateVersion: this.#stateVersion
		};
	}

	static fromSerialized(data: SerializedEditor): Editor {
		const drawing = Drawing.fromSerialized(data.drawing);
		const selection = data.selection ? { ...data.selection } : undefined;

		return new Editor(data.tool, drawing, selection, data.stateVersion);
	}
}

export type SerializedEditor = {
	type: 'Editor';
	tool: ToolType;
	drawing: SerializedDrawing;
	selection?: SelectedVertex;
	stateVersion: number;
};

export type ToolType = 'select' | 'curve';

function makeDefaultDrawing() {
	return new Drawing([
		Vertex.fromPercent(50, 0),
		Vertex.fromPercent(100, 100),
		Vertex.fromPercent(0, 100)
	]);
}

type SelectedVertex = {
	id: string;
	part: VertexPart;
};

export type VertexPart = 'position' | 'controlPointForward' | 'controlPointBackward';

export const editor = new Editor();

export function selectVertex(id: string, part: VertexPart = 'position') {
	if (editor.selection?.id === id && editor.selection.part === part) {
		return;
	}
	editor.selection = { id, part };
}

export function clearVertexSelection() {
	editor.selection = undefined;
}

export function updateVertex(updatedVertex: Vertex) {
	editor.drawing.updateVertex(updatedVertex);
}

export function deleteVertex(id: string) {
	// Delete the vertex from the drawing (this will throw on failure)
	editor.drawing.deleteVertex(id);

	// Clear selection if the deleted vertex was currently selected
	if (editor.selection?.id === id) {
		editor.selection = undefined;
	}
}

export function deleteControlPoint(id: string, direction: 'forward' | 'backward') {
	// Delete the control point from the drawing (this will throw on failure)
	editor.drawing.deleteControlPoint(id, direction);

	// Clear selection if the deleted control point was currently selected
	const expectedPart = direction === 'forward' ? 'controlPointForward' : 'controlPointBackward';
	if (editor.selection?.id === id && editor.selection.part === expectedPart) {
		editor.selection = undefined;
	}
}

export function deleteSelection() {
	if (!editor.selection) return;

	if (editor.selection.part === 'position') {
		deleteVertex(editor.selection.id);
	} else {
		const direction = editor.selection.part === 'controlPointForward' ? 'forward' : 'backward';
		deleteControlPoint(editor.selection.id, direction);
	}
}
