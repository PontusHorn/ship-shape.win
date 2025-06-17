<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { cssPropertiesToCss } from '$lib/css';
	import AddVertexButton from '$lib/AddVertexButton.svelte';
	import CssOutput from '$lib/CssOutput.svelte';
	import { Drawing } from '$lib/Drawing.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import { vertexFromPercent } from '$lib/Vertex';
	import VertexHandle from '$lib/VertexHandle.svelte';
	import type { Attachment } from 'svelte/attachments';
	import Toolbar from '$lib/Toolbar.svelte';
	import { editor } from '$lib/editor.svelte';

	const previewWidth = 300;
	const previewHeight = 300;

	let drawing = $state(
		new Drawing([vertexFromPercent(50, 0), vertexFromPercent(100, 100), vertexFromPercent(0, 100)])
	);
	const cssProperties = $derived({ 'clip-path': drawing.toShape().toString() });

	let lastAddedVertexId = $state<string>();
	function focusWhenAdded(vertexId: string): Attachment {
		return (element: Element) => {
			if (element instanceof HTMLElement && vertexId === lastAddedVertexId) {
				element.focus();
			}
		};
	}
</script>

<svelte:head>
	<title>Visual shape() editor - {SITE_TITLE}</title>
	<meta name="description" content={`TODO ${SITE_DESCRIPTION}`} />
</svelte:head>

<GeneratorLayout>
	<Toolbar />

	<form></form>

	{#snippet preview()}
		<div class="preview" style:width={previewWidth + 'px'} style:height={previewHeight + 'px'}>
			<div class="shape" style={cssPropertiesToCss(cssProperties)}></div>

			{#each drawing.vertices as vertex (vertex.id)}
				<VertexHandle
					{vertex}
					{previewWidth}
					{previewHeight}
					draggingEnabled={editor.tool === 'select'}
					{@attach focusWhenAdded(vertex.id)}
				/>
			{/each}

			{#each drawing.curves() as curve, index (curve.map((v) => v.id).join())}
				{@const position = drawing.getMidpointAt(previewWidth, previewHeight, index)}
				<AddVertexButton
					{position}
					onAddVertex={() => {
						lastAddedVertexId = drawing.insertVertex(index, position);
					}}
				/>
			{/each}
		</div>
	{/snippet}

	{#snippet output()}
		<CssOutput {cssProperties} />
	{/snippet}
</GeneratorLayout>

<style>
	form {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: baseline;
		align-content: start;
		gap: 0.5rem 0.25rem;
	}

	.preview {
		position: relative;
	}

	.shape {
		background-color: var(--jade);
		width: 100%;
		height: 100%;
	}
</style>
