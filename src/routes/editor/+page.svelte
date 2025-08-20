<script lang="ts">
	import CssOutput from '$lib/CssOutput.svelte';
	import Toolbar from '$lib/Toolbar.svelte';
	import EditorLayout from '$lib/editor/EditorLayout.svelte';
	import VertexForm from '$lib/editor/VertexForm.svelte';
	import EditorDrawing from '$lib/editor/EditorDrawing.svelte';
	import { editor } from '$lib/editor/Editor.svelte';
	import Head from '$lib/Head.svelte';

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

<Head
	title="Visual shape() editor"
	description="Drag-n-drop visual editor for simple CSS shapes."
/>

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
