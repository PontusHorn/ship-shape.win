import { Drawing } from './Drawing.svelte';
import { vertexFromPercent } from './Vertex';

export type ToolType = 'select' | 'curve';

export type EditorState = {
	tool: ToolType;
	drawing: Drawing;
	selection: SelectedVertex | undefined;
};

type SelectedVertex = {
	id: string;
	part: VertexPart;
};

export type VertexPart = 'position' | 'controlPointForward' | 'controlPointBackward';

export const editor = $state<EditorState>({
	tool: 'select',
	drawing: new Drawing([
		vertexFromPercent(50, 0),
		vertexFromPercent(100, 100),
		vertexFromPercent(0, 100)
	]),
	selection: undefined
});

export function selectTool(tool: ToolType) {
	// Don't allow toggling the tool off - we want a tool to always be selected,
	// but `ToggleGroup` does not support this behaviour natively.
	if (!tool) return;
	editor.tool = tool;
}

export function selectVertex(id: string, part: VertexPart = 'position') {
	if (editor.selection?.id === id && editor.selection.part === part) {
		return;
	}
	editor.selection = { id, part };
}

export function clearVertexSelection() {
	editor.selection = undefined;
}

export function deleteVertex(id: string) {
	// Delete the vertex from the drawing (this will throw on failure)
	editor.drawing.deleteVertex(id);

	// Clear selection if the deleted vertex was currently selected
	if (editor.selection?.id === id) {
		editor.selection = undefined;
	}
}
