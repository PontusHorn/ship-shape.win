<script lang="ts">
	import { Redo, Undo } from '@lucide/svelte';
	import Button from '../Button.svelte';
	import { editor } from './Editor.svelte';
	import ToolSelector from './ToolSelector.svelte';
	import { display } from '$lib/display.svelte';
	import { disableUntilHydrated } from '$lib/util/disableUntilHydrated';

	let showEditorHandlesInput: HTMLInputElement;
</script>

<div class="toolbar">
	<div class="tool-selector">
		<ToolSelector />
	</div>

	<div class="history">
		<Button
			type="button"
			size="small"
			onclick={() => editor.history.undo()}
			disabled={editor.history.undoStack.length === 0}
		>
			{#snippet icon()}
				<Undo aria-hidden="true" size={12} absoluteStrokeWidth />
			{/snippet}
			Undo
		</Button>
		<Button
			type="button"
			size="small"
			onclick={() => editor.history.redo()}
			disabled={editor.history.redoStack.length === 0}
		>
			{#snippet icon()}
				<Redo aria-hidden="true" size={12} absoluteStrokeWidth />
			{/snippet}
			<span class="visually-hidden">Redo</span>
		</Button>
	</div>

	<div class="display">
		<span class="display-setting">
			<label for="show-editor-handles">Show handles</label>
			<input
				id="show-editor-handles"
				bind:this={showEditorHandlesInput}
				type="checkbox"
				checked={display.showEditorHandles}
				onchange={(event) => (display.showEditorHandles = event.currentTarget.checked)}
				{...disableUntilHydrated()}
			/>
		</span>
	</div>
</div>

<svelte:window
	onkeydown={(event) => {
		// Toggle editor handles with H
		if (event.key === 'h') {
			display.showEditorHandles = !display.showEditorHandles;
			showEditorHandlesInput.focus();
		}
	}}
/>

<style>
	.toolbar {
		display: grid;
		grid-template-areas:
			'tool-selector history'
			'display display';
		grid-template-columns: 1fr auto;
		justify-items: start;
		align-items: center;
		gap: 0.5rem;
	}

	.tool-selector {
		grid-area: tool-selector;
	}

	.history {
		grid-area: history;
		display: flex;
	}

	.display {
		grid-area: display;
		justify-self: end;
		display: flex;
		gap: 0.25em;
	}

	.display-setting {
		display: flex;
		align-items: center;
		gap: 0.125em;
	}
</style>
