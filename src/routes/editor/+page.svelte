<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import AddVertexButton from '$lib/AddVertexButton.svelte';
	import CssOutput from '$lib/CssOutput.svelte';
	import { moveVertex, moveVertexControlPoint, type Vertex } from '$lib/Vertex';
	import { VertexDimension } from '$lib/VertexDimension';
	import VertexHandleCurve from '$lib/VertexHandleCurve.svelte';
	import VertexHandleSelect from '$lib/VertexHandleSelect.svelte';
	import Toolbar from '$lib/Toolbar.svelte';
	import { clearVertexSelection, editor, selectVertex } from '$lib/editor.svelte';
	import EditorLayout from '$lib/EditorLayout.svelte';
	import type { Vector } from '$lib/vector';
	import { tick } from 'svelte';
	import { getVertexButton } from '$lib/elementIds';
	import { getShapeCssProperties } from '$lib/output';
	import ShapePreview from '$lib/ShapePreview.svelte';
	import { outputConfig } from '$lib/outputConfig.svelte';

	const previewSize: Vector = [300, 300];

	const shape = $derived(editor.drawing.toShape(previewSize));

	const cssProperties = $derived(
		getShapeCssProperties(shape, outputConfig.shapeProperty, outputConfig.codeStyle)
	);

	const selectedVertex = $derived.by(() => {
		const { selection, drawing } = editor;
		if (!selection) return;

		const selectedVertex = drawing.vertices.find((v) => v.id === selection.id);
		if (!selectedVertex) throw new Error('Selected vertex not found');

		return selectedVertex;
	});

	const selectedPosition = $derived.by(() => {
		const { selection } = editor;
		if (!selection || !selectedVertex) return;

		const position = selectedVertex[selection.part];
		if (!position) throw new Error(`Position "${selection.part}" not found in vertex`);

		return position;
	});

	function onChangeVertex(vertex: Vertex) {
		const index = editor.drawing.vertices.findIndex(({ id }) => id === vertex.id);
		if (index === -1) {
			throw new Error('Vertex not found');
		}
		editor.drawing.vertices[index] = vertex;
	}

	function handleVertexInputChange(coordinate: 'x' | 'y', value: number) {
		if (!editor.selection || !selectedVertex || !selectedPosition) {
			throw new Error('Invalid selection');
		}

		if (Number.isNaN(value)) return;

		const { x, y } = selectedPosition;
		const newPosition =
			coordinate === 'x'
				? selectedPosition.withX(x.withValue(value))
				: selectedPosition.withY(y.withValue(value));

		let newVertex: Vertex;
		switch (editor.selection.part) {
			case 'position':
				newVertex = moveVertex(selectedVertex, newPosition, previewSize);
				break;
			case 'controlPointForward':
				newVertex = moveVertexControlPoint(selectedVertex, 'forward', newPosition, previewSize);
				break;
			case 'controlPointBackward':
				newVertex = moveVertexControlPoint(selectedVertex, 'backward', newPosition, previewSize);
				break;
		}

		onChangeVertex(newVertex);
	}

	function handleVertexTypeChange(coordinate: 'x' | 'y', newType: string) {
		if (!editor.selection || !selectedVertex || !selectedPosition) {
			throw new Error('Invalid selection');
		}

		if (newType !== 'percent' && newType !== 'px_from_start' && newType !== 'px_from_end') {
			return;
		}

		const currentDimension = coordinate === 'x' ? selectedPosition.x : selectedPosition.y;
		const maxPx = coordinate === 'x' ? previewSize[0] : previewSize[1];

		// Convert current value to pixels, then to new type
		const currentPixels = currentDimension.toPixels(maxPx);
		const newDimension = VertexDimension.fromPixels(newType, maxPx, currentPixels);

		const newPosition =
			coordinate === 'x'
				? selectedPosition.withX(newDimension)
				: selectedPosition.withY(newDimension);

		onChangeVertex({
			...selectedVertex,
			[editor.selection.part]: newPosition
		});
	}

	function handleVertexMirroredChange(isMirrored: boolean) {
		if (!selectedVertex) {
			throw new Error('Invalid selection');
		}

		let newVertex = { ...selectedVertex, isMirrored };

		// If we turn on mirroring, we need to update the control points to be
		// mirrored as well
		if (isMirrored && selectedVertex.controlPointForward) {
			newVertex.controlPointBackward = selectedVertex.controlPointForward
				.toMirrored(selectedVertex.position, previewSize)
				.toRounded();
		} else if (isMirrored && selectedVertex.controlPointBackward) {
			newVertex.controlPointForward = selectedVertex.controlPointBackward
				.toMirrored(selectedVertex.position, previewSize)
				.toRounded();
		}

		onChangeVertex(newVertex);
	}

	function handleBackgroundClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			clearVertexSelection();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && editor.selection) {
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

		<div class="preview" class:hasSelection={!!editor.selection}>
			<ShapePreview {cssProperties} {shape} />

			{#each editor.drawing.vertices as vertex, index (vertex.id)}
				{#if editor.tool === 'select'}
					<VertexHandleSelect {vertex} {onChangeVertex} maxSize={previewSize} />
				{:else if editor.tool === 'curve'}
					<VertexHandleCurve
						{vertex}
						{onChangeVertex}
						defaultControlPointPosition={editor.drawing.getTangentialPositionAt(
							previewSize,
							30,
							index
						)}
						maxSize={previewSize}
					/>
				{/if}
			{/each}

			{#each editor.drawing.curves() as curve, index (curve.map((v) => v.id).join())}
				{@const position = editor.drawing.getMidpointAt(previewSize, index)}
				<AddVertexButton
					{position}
					maxSize={previewSize}
					onAddVertex={() => {
						const newVertexId = editor.drawing.insertVertex(index, position);

						// Select the first control point, and focus it after mount
						selectVertex(newVertexId);
						tick().then(() => {
							getVertexButton(newVertexId)?.focus();
						});
					}}
				/>
			{/each}
		</div>
	{/snippet}

	<Toolbar />

	<form>
		{#if selectedVertex && selectedPosition}
			<fieldset>
				<legend>
					{#if editor.selection?.part === 'position'}Vertex position{:else}Control point position{/if}
				</legend>

				<div class="vertexPosition">
					<label for="vertex-x">X:</label>
					<input
						id="vertex-x"
						type="number"
						value={selectedPosition.x.value.toString()}
						oninput={(e) => handleVertexInputChange('x', e.currentTarget.valueAsNumber)}
					/>

					<label for="vertex-x-type" class="visually-hidden">X type</label>
					<select
						id="vertex-x-type"
						value={selectedPosition.x.type}
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
						value={selectedPosition.y.value.toString()}
						oninput={(e) => handleVertexInputChange('y', e.currentTarget.valueAsNumber)}
					/>

					<label for="vertex-y-type" class="visually-hidden">Y type</label>
					<select
						id="vertex-y-type"
						value={selectedPosition.y.type}
						onchange={(e) => handleVertexTypeChange('y', e.currentTarget.value)}
					>
						<option value="percent">%</option>
						<option value="px_from_start">px</option>
						<option value="px_from_end">px (from bottom)</option>
					</select>

					<input
						id="vertex-mirrored"
						type="checkbox"
						checked={selectedVertex.isMirrored}
						onchange={(event) => handleVertexMirroredChange(event.currentTarget.checked)}
					/>
					<label for="vertex-mirrored">Mirrored control points</label>
				</div>
			</fieldset>
		{/if}
	</form>

	{#snippet output()}
		<CssOutput {cssProperties} />
	{/snippet}
</EditorLayout>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.vertexPosition {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		align-content: start;
		gap: 0.5rem 0.25rem;

		label {
			margin-inline-end: 0.25rem;
		}

		input[type='number'],
		select {
			align-self: stretch;
			min-width: 0;
		}

		input[type='checkbox'] {
			justify-self: start;
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
</style>
