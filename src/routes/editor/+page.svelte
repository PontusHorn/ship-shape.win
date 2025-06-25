<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { cssPropertiesToCss } from '$lib/css';
	import AddVertexButton from '$lib/AddVertexButton.svelte';
	import CssOutput from '$lib/CssOutput.svelte';
	import { Drawing } from '$lib/Drawing.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import { vertexFromPercent, type Vertex } from '$lib/Vertex';
	import VertexHandleCurve from '$lib/VertexHandleCurve.svelte';
	import VertexHandleSelect from '$lib/VertexHandleSelect.svelte';
	import type { Attachment } from 'svelte/attachments';
	import Toolbar from '$lib/Toolbar.svelte';
	import { clearVertexSelection, editor } from '$lib/editor.svelte';

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

	function onChangeVertex(vertex: Vertex) {
		const index = drawing.vertices.findIndex(({ id }) => id === vertex.id);
		if (index === -1) {
			throw new Error('Vertex not found');
		}
		drawing.vertices[index] = vertex;
	}

	function handleBackgroundClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			clearVertexSelection();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && editor.selectedVertexId) {
			clearVertexSelection();
			event.preventDefault();
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
	<title>Visual shape() editor - {SITE_TITLE}</title>
	<meta name="description" content={`TODO ${SITE_DESCRIPTION}`} />
</svelte:head>

<GeneratorLayout>
	<Toolbar />

	<form></form>

	{#snippet preview()}
		<button class="background" onclick={handleBackgroundClick}>
			<span class="visually-hidden">Clear selection</span>
		</button>

		<div
			class="preview"
			class:hasSelection={!!editor.selectedVertexId}
			style:width={previewWidth + 'px'}
			style:height={previewHeight + 'px'}
		>
			<div class="shape" style={cssPropertiesToCss(cssProperties)}></div>

			{#each drawing.vertices as vertex, index (vertex.id)}
				{#if editor.tool === 'select'}
					<VertexHandleSelect
						{vertex}
						{onChangeVertex}
						{previewWidth}
						{previewHeight}
						{@attach focusWhenAdded(vertex.id)}
					/>
				{:else if editor.tool === 'curve'}
					<VertexHandleCurve
						{vertex}
						{onChangeVertex}
						defaultControlPointPosition={drawing.getTangentialPositionAt(
							previewWidth,
							previewHeight,
							30,
							index
						)}
						{previewWidth}
						{previewHeight}
					/>
				{/if}
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

	.background {
		all: unset;
		position: absolute;
		inset: 0;
	}

	.preview {
		position: relative;
	}

	.shape {
		background-color: var(--jade);
		width: 100%;
		height: 100%;
		/* Add a faint outline that shows when the clip-path extends outside the
		element bounds, so it's easier to see the path */
		outline: 9999px solid color-mix(in srgb, var(--jade), transparent 90%);
	}
</style>
