<script lang="ts">
	import { Redo, Undo } from '@lucide/svelte';
	import Button from '../Button.svelte';
	import { editor } from './Editor.svelte';
	import ToolSelector from './ToolSelector.svelte';
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
</div>

<style>
	.toolbar {
		display: grid;
		grid-template-areas: 'tool-selector history';
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
</style>
