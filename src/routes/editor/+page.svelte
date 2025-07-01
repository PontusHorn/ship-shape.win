<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { cssPropertiesToCss } from '$lib/css';
	import AddVertexButton from '$lib/AddVertexButton.svelte';
	import CssOutput from '$lib/CssOutput.svelte';
	import { Drawing } from '$lib/Drawing.svelte';
	import { vertexFromPercent, type Vertex } from '$lib/Vertex';
	import { VertexDimension } from '$lib/VertexDimension';
	import VertexHandleCurve from '$lib/VertexHandleCurve.svelte';
	import VertexHandleSelect from '$lib/VertexHandleSelect.svelte';
	import type { Attachment } from 'svelte/attachments';
	import Toolbar from '$lib/Toolbar.svelte';
	import { clearVertexSelection, editor } from '$lib/editor.svelte';
	import EditorLayout from '$lib/EditorLayout.svelte';

	const previewWidth = 300;
	const previewHeight = 300;

	let drawing = $state(
		new Drawing([vertexFromPercent(50, 0), vertexFromPercent(100, 100), vertexFromPercent(0, 100)])
	);
	const cssProperties = $derived({ 'clip-path': drawing.toShape().toString() });

	const selectedVertex = $derived(
		editor.selectedVertexId
			? drawing.vertices.find((v) => v.id === editor.selectedVertexId)
			: undefined
	);

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

	function handleVertexInputChange(coordinate: 'x' | 'y', value: number) {
		if (!selectedVertex) throw new Error('No vertex selected');
		if (Number.isNaN(value)) return;

		const position = selectedVertex.position;
		const newPosition =
			coordinate === 'x'
				? position.withX(position.x.withValue(value))
				: position.withY(position.y.withValue(value));

		onChangeVertex({
			...selectedVertex,
			position: newPosition
		});
	}

	function handleVertexTypeChange(coordinate: 'x' | 'y', newType: string) {
		if (!selectedVertex) throw new Error('No vertex selected');
		if (newType !== 'percent' && newType !== 'px_from_start' && newType !== 'px_from_end') {
			return;
		}

		const currentDimension =
			coordinate === 'x' ? selectedVertex.position.x : selectedVertex.position.y;
		const maxPx = coordinate === 'x' ? previewWidth : previewHeight;

		// Convert current value to pixels, then to new type
		const currentPixels = currentDimension.toPixels(maxPx);
		const newDimension = VertexDimension.fromPixels(newType, maxPx, currentPixels);

		const position = selectedVertex.position;
		const newPosition =
			coordinate === 'x' ? position.withX(newDimension) : position.withY(newDimension);

		onChangeVertex({
			...selectedVertex,
			position: newPosition
		});
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

<EditorLayout>
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

	<Toolbar />

	<form>
		{#if selectedVertex}
			<label for="vertex-x">X:</label>
			<input
				id="vertex-x"
				type="number"
				value={selectedVertex.position.x.value.toString()}
				oninput={(e) => handleVertexInputChange('x', e.currentTarget.valueAsNumber)}
			/>

			<label for="vertex-x-type" class="visually-hidden">X type</label>
			<select
				id="vertex-x-type"
				value={selectedVertex.position.x.type}
				onchange={(e) => handleVertexTypeChange('x', e.currentTarget.value)}
			>
				<option value="percent">%</option>
				<option value="px_from_start">px</option>
				<option value="px_from_end">px (from right)</option>
			</select>

			<label for="vertex-y">Y:</label>
			<input
				id="vertex-y"
				type="number"
				value={selectedVertex.position.y.value.toString()}
				oninput={(e) => handleVertexInputChange('y', e.currentTarget.valueAsNumber)}
			/>

			<label for="vertex-y-type" class="visually-hidden">Y type</label>
			<select
				id="vertex-y-type"
				value={selectedVertex.position.y.type}
				onchange={(e) => handleVertexTypeChange('y', e.currentTarget.value)}
			>
				<option value="percent">%</option>
				<option value="px_from_start">px</option>
				<option value="px_from_end">px (from bottom)</option>
			</select>
		{/if}
	</form>

	{#snippet output()}
		<CssOutput {cssProperties} />
	{/snippet}
</EditorLayout>

<style>
	form {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		align-content: start;
		gap: 0.5rem 0.25rem;

		label {
			margin-inline-end: 0.25rem;
		}

		input,
		select {
			align-self: stretch;
			min-width: 0;
		}
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
