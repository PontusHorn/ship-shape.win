<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, preview, output }: { children: Snippet; preview: Snippet; output: Snippet } =
		$props();
</script>

<main>
	<div class="preview-pane">
		{@render preview()}
	</div>

	<div class="tools-pane">
		{@render children()}
	</div>

	<div class="output-pane">
		{@render output()}
	</div>
</main>

<style>
	main {
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

		background: var(--pistachio);
		border-radius: 1.5rem;
		box-shadow: inset 1px 2px 4px rgb(0 0 0 / 0.05);
	}

	.output-pane {
		grid-area: output;
		min-inline-size: 0;
	}
</style>
