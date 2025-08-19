<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import CssOutput from '$lib/CssOutput.svelte';
	import Toolbar from '$lib/Toolbar.svelte';
	import EditorLayout from '$lib/editor/EditorLayout.svelte';
	import VertexForm from '$lib/editor/VertexForm.svelte';
	import EditorDrawing from '$lib/editor/EditorDrawing.svelte';
	import { editor } from '$lib/editor/Editor.svelte';

	function handleKeyDown(event: KeyboardEvent) {
		const ctrlOrMeta = event.metaKey || event.ctrlKey;
		if (ctrlOrMeta && event.key === 'z') {
			if (event.shiftKey) {
				editor.history.redo();
			} else {
				editor.history.undo();
			}
			event.preventDefault();
			return;
		}

		if (ctrlOrMeta && event.key === 'y') {
			editor.history.redo();
			event.preventDefault();
			return;
		}
	}
</script>

<svelte:head>
	<title>Visual shape() editor - {SITE_TITLE}</title>
	<meta
		name="description"
		content={`Drag-n-drop visual editor for simple CSS shapes. ${SITE_DESCRIPTION}`}
	/>
</svelte:head>

<svelte:window onkeydown={handleKeyDown} />

<h1 class="visually-hidden">Visual shape() editor</h1>

<EditorLayout>
	{#snippet preview()}
		<EditorDrawing />
	{/snippet}

	<Toolbar />

	<VertexForm />

	{#snippet output()}
		<CssOutput cssProperties={editor.drawingCssProperties} />
	{/snippet}
</EditorLayout>
