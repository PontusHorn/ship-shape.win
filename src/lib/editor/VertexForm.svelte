<script lang="ts">
	import { editor, deleteSelection, updateVertex } from '$lib/editor/editor.svelte';
	import { UserError } from '$lib/UserError';
	import Button from '$lib/Button.svelte';
	import { assert } from '$lib/util/assert';
	import { isDimensionType } from './VertexDimension';
	import { outputConfig } from '$lib/outputConfig.svelte';

	let maxSize = $derived(outputConfig.previewSize);
	let { selection, selectedVertex, selectedVertexPosition } = $derived(editor);

	let errorMessage = $state('');

	function handleVertexInputChange(dimension: 'x' | 'y', value: number) {
		assert(selection && selectedVertex && selectedVertexPosition, 'Invalid selection');

		if (Number.isNaN(value)) return;

		const newVertex = selectedVertex.withDimensionValue(selection.part, dimension, value, maxSize);
		updateVertex(newVertex);
	}

	function handleVertexTypeChange(dimension: 'x' | 'y', newType: string) {
		assert(selection && selectedVertex, 'Invalid selection');
		assert(isDimensionType(newType), `Invalid dimension type: ${newType}`);

		const newVertex = selectedVertex.withConvertedDimensionType(
			selection.part,
			dimension,
			newType,
			maxSize
		);
		updateVertex(newVertex);
	}

	function handleVertexMirroredChange(isMirrored: boolean) {
		assert(selectedVertex, 'Invalid selection');

		const newVertex = selectedVertex.withMirrored(isMirrored, maxSize);
		updateVertex(newVertex);
	}

	function handleDeleteButtonClick() {
		try {
			deleteSelection();
		} catch (error) {
			errorMessage = error instanceof UserError ? error.userMessage : 'Failed to delete';
			const errorPopover = document.getElementById('form-error');
			errorPopover?.showPopover();
		}
	}
</script>

<form>
	{#if selectedVertex && selectedVertexPosition}
		<fieldset>
			<legend>
				{#if selection?.part === 'position'}Vertex position{:else}Control point position{/if}
			</legend>

			<div class="vertexPosition">
				<label for="vertex-x">X:</label>
				<input
					id="vertex-x"
					type="number"
					value={selectedVertexPosition.x.value.toString()}
					oninput={(e) => handleVertexInputChange('x', e.currentTarget.valueAsNumber)}
				/>

				<label for="vertex-x-type" class="visually-hidden">X type</label>
				<select
					id="vertex-x-type"
					value={selectedVertexPosition.x.type}
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
					value={selectedVertexPosition.y.value.toString()}
					oninput={(e) => handleVertexInputChange('y', e.currentTarget.valueAsNumber)}
				/>

				<label for="vertex-y-type" class="visually-hidden">Y type</label>
				<select
					id="vertex-y-type"
					value={selectedVertexPosition.y.type}
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
				{#if selection?.part === 'position'}
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
		position: fixed;
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

		/* Show in center of screen when anchor positioning is not supported */
		@supports not (position-area: start start) {
			margin: auto;
		}
	}
</style>
