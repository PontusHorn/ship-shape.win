<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { cssPropertiesToCss } from '$lib/css';
	import CssOutput from '$lib/CssOutput.svelte';
	import { Drawing } from '$lib/Drawing';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import { percent } from '$lib/LengthPercentage';
	import { Position } from '$lib/Position';
	import VertexHandle from '$lib/VertexHandle.svelte';

	let drawing = $state(
		new Drawing([
			{ position: new Position(percent(50), percent(0)) },
			{ position: new Position(percent(100), percent(100)) },
			{ position: new Position(percent(0), percent(100)) }
		])
	);
	const cssProperties = $derived({ 'clip-path': drawing.toShape().toString() });
</script>

<svelte:head>
	<title>Visual shape() editor - {SITE_TITLE}</title>
	<meta name="description" content={`TODO ${SITE_DESCRIPTION}`} />
</svelte:head>

<GeneratorLayout>
	<form></form>

	{#snippet preview()}
		<div class="preview">
			<div class="shape" style={cssPropertiesToCss(cssProperties)}></div>
			{#each drawing.vertices as vertex (vertex)}
				<VertexHandle {vertex} />
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
		width: 300px;
		height: 300px;
	}

	.shape {
		background-color: var(--jade);
		width: 100%;
		height: 100%;
	}
</style>
