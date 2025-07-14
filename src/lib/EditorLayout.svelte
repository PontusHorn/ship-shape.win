<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, preview, output }: { children: Snippet; preview: Snippet; output: Snippet } =
		$props();
</script>

<div class="page">
	<div class="preview-pane">
		{@render preview()}
	</div>

	<div class="tools-pane">
		{@render children()}
	</div>

	<div class="output-pane">
		{@render output()}
	</div>
</div>

<style>
	.page {
		display: grid;
		grid-template-areas:
			'preview tools'
			'output output';
		grid-template-columns: 1fr min(50ch, 50%);
		min-block-size: 100vh;
		padding: 1rem;
		gap: 1rem;

		@media (width < 800px) {
			grid-template-areas:
				'preview'
				'tools'
				'output';
			grid-template-columns: 1fr;
			grid-template-rows: auto auto 1fr;
		}
	}

	.tools-pane {
		grid-area: tools;
		display: grid;
		align-content: start;
		gap: 1rem;
	}

	.preview-pane {
		grid-area: preview;
		position: relative;
		display: grid;
		place-items: center;
		place-content: center;
		padding: 2rem;
		min-inline-size: 0;

		background: var(--brand-050);
		border-radius: 1.5rem;
		box-shadow: inset 0.5px 1px 2px var(--brand-200);
	}

	.output-pane {
		grid-area: output;
		min-inline-size: 0;
	}
</style>
