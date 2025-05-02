<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { CoordinatePair } from '$lib/CoordinatePair';
	import { cssPropertiesToCss } from '$lib/css';
	import CssOutput from '$lib/CssOutput.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import { percent, raw } from '$lib/LengthPercentage';
	import { StarPolygon } from '$lib/parametricShapes/StarPolygon';

	let points = $state(6);
	let outerRadius = $state('50%');
	let innerRadius = $state('20%');
	let rotation = $state(0);
	const center = new CoordinatePair(percent(50), percent(50));
	const polygon = $derived(
		new StarPolygon(points, raw(outerRadius), raw(innerRadius), center, rotation)
	);
	const cssProperties = $derived(polygon.toCssProperties('clip-path'));
</script>

<svelte:head>
	<title>Star shape() generator - {SITE_TITLE}</title>
	<meta name="description" content={`Generates that most pointy of shapes. ${SITE_DESCRIPTION}`} />
	<script type="module" src="/elements/copy-button.js"></script>
</svelte:head>

<GeneratorLayout>
	<h1>Star polygon</h1>
	<p>Generates that most pointy of shapes.</p>
	<form>
		<label for="points">Number of points:</label>
		<input id="points" type="number" bind:value={points} min="3" />

		<label for="outer-radius">Outer radius:</label>
		<input id="outer-radius" type="text" bind:value={outerRadius} />

		<label for="inner-radius">Inner radius:</label>
		<input id="inner-radius" type="text" bind:value={innerRadius} />

		<label for="rotation">Rotation:</label>
		<input
			id="rotation"
			type="range"
			bind:value={rotation}
			min="0"
			max="1"
			step="0.01"
			list="rotation-ticks"
		/>
		<datalist id="rotation-ticks">
			<option value="0"></option>
			<option value="0.25"></option>
			<option value="0.5"></option>
			<option value="0.75"></option>
			<option value="1"></option>
		</datalist>
	</form>

	{#snippet preview()}
		<div class="preview" style={cssPropertiesToCss(cssProperties)}></div>
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

	label {
		text-align: right;
	}

	.preview {
		background-color: var(--jade);
		width: 300px;
		height: 300px;
	}
</style>
