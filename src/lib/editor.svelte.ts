export type ToolType = 'select' | 'curve';
export type EditorState = {
	tool: ToolType;
};

export const editor = $state<EditorState>({
	tool: 'select'
});

export function selectTool(tool: ToolType) {
	// Don't allow toggling the tool off - we want a tool to always be selected,
	// but `ToggleGroup` does not support this behaviour natively.
	if (!tool) return;
	editor.tool = tool;
}
