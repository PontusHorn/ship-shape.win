export type Display = {
	showEditorHandles: boolean;
};

export const display = $state<Display>({
	showEditorHandles: true
});
