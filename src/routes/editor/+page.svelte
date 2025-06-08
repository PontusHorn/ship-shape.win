<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { cssPropertiesToCss } from '$lib/css';
	import CssOutput from '$lib/CssOutput.svelte';
	import { Drawing } from '$lib/Drawing';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import { vertexFromPercent } from '$lib/Vertex';
	import VertexHandle from '$lib/VertexHandle.svelte';

	const previewWidth = 300;
	const previewHeight = 300;

	let drawing = $state(
		new Drawing([vertexFromPercent(50, 0), vertexFromPercent(100, 100), vertexFromPercent(0, 100)])
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
		<div class="preview" style:width={previewWidth + 'px'} style:height={previewHeight + 'px'}>
			<div class="shape" style={cssPropertiesToCss(cssProperties)}></div>
			{#each drawing.vertices as vertex (vertex.id)}
				<VertexHandle {vertex} {previewWidth} {previewHeight} />
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
	}

	.shape {
		background-color: var(--jade);
		width: 100%;
		height: 100%;
	}
</style>
