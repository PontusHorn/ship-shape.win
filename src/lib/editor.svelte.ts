export type ToolType = 'select' | 'curve';
export type EditorState = {
	tool: ToolType;
	selectedVertexId: string | undefined;
};

export const editor = $state<EditorState>({
	tool: 'select',
	selectedVertexId: undefined
});

export function selectTool(tool: ToolType) {
	// Don't allow toggling the tool off - we want a tool to always be selected,
	// but `ToggleGroup` does not support this behaviour natively.
	if (!tool) return;
	editor.tool = tool;
	// Clear selected vertex when switching tools
	if (tool !== 'curve') {
		editor.selectedVertexId = undefined;
	}
}

export function selectVertex(vertexId: string) {
	editor.selectedVertexId = vertexId;
}

export function clearVertexSelection() {
	editor.selectedVertexId = undefined;
}
