<script lang="ts">
	import { moveVertex, moveVertexControlPoint, type Vertex } from '$lib/editor/Vertex';
	import { VertexDimension } from '$lib/editor/VertexDimension';
	import {
		deleteVertex,
		deleteControlPoint,
		editor,
		updateVertex
	} from '$lib/editor/editor.svelte';
	import { type Vector } from '$lib/util/vector';
	import { UserError } from '$lib/UserError';
	import Button from '$lib/Button.svelte';

	const previewSize: Vector = [300, 300];

	let errorMessage = $state('');

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

		updateVertex(newVertex);
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

		updateVertex({
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

		updateVertex(newVertex);
	}

	function handleDeleteButtonClick() {
		if (!editor.selection) return;

		try {
			if (editor.selection.part === 'position') {
				deleteVertex(editor.selection.id);
			} else {
				const direction = editor.selection.part === 'controlPointForward' ? 'forward' : 'backward';
				deleteControlPoint(editor.selection.id, direction);
			}
		} catch (error) {
			errorMessage = error instanceof UserError ? error.userMessage : 'Failed to delete';
			const errorPopover = document.getElementById('form-error');
			errorPopover?.showPopover();
		}
	}
</script>

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

		<div class="actions">
			<Button
				type="button"
				size="small"
				onclick={handleDeleteButtonClick}
				--backgroundColor="var(--error-300)"
			>
				{#if editor.selection?.part === 'position'}
					Delete vertex
				{:else}
					Delete control point
				{/if}
			</Button>
		</div>
	{/if}
</form>

<div
	role="alert"
	class="error"
	id="form-error"
	popover="auto"
	ontoggle={(event) => {
		if (event.newState === 'closed') {
			errorMessage = '';
		}
	}}
>
	{errorMessage}
</div>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		anchor-name: --form;
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

	.actions {
		display: flex;
		gap: 0.5rem;
		justify-content: end;
	}

	.error:popover-open {
		position: absolute;
		position-anchor: --form;
		position-area: block-end;
		position-try: flip-block;
		margin: 2rem;
		max-inline-size: 30ch;
		padding-block: 0.3rem;
		padding-inline: 0.5rem;

		background-color: var(--error-300);
		border: 2px solid var(--error-950);
		border-radius: 0.5rem;
		color: var(--error-950);
	}
</style>
