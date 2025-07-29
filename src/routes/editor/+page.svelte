<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import CssOutput from '$lib/CssOutput.svelte';
	import Toolbar from '$lib/Toolbar.svelte';
	import EditorLayout from '$lib/editor/EditorLayout.svelte';
	import VertexForm from '$lib/editor/VertexForm.svelte';
	import EditorDrawing from '$lib/editor/EditorDrawing.svelte';
	import { editor } from '$lib/editor/editor.svelte';
</script>

<svelte:head>
	<title>Visual shape() editor - {SITE_TITLE}</title>
	<meta name="description" content={`TODO ${SITE_DESCRIPTION}`} />
</svelte:head>

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
