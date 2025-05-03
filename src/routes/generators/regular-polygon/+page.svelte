<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { CoordinatePair } from '$lib/CoordinatePair';
	import { cssPropertiesToCss } from '$lib/css';
	import CssOutput from '$lib/CssOutput.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import { percent, raw } from '$lib/LengthPercentage';
	import { RegularPolygon } from '$lib/parametricShapes/RegularPolygon';

	let sides = $state(6);
	let radius = $state('50%');
	let rotation = $state(0);
	let swell = $state(1);
	const center = new CoordinatePair(percent(50), percent(50));
	const polygon = $derived(new RegularPolygon(sides, raw(radius), center, rotation, swell));
	const cssProperties = $derived(polygon.toCssProperties('clip-path'));
</script>

<svelte:head>
	<title>Regular polygon shape() generator - {SITE_TITLE}</title>
	<meta
		name="description"
		content={`Generates anything from a triangle to an icosagon. ${SITE_DESCRIPTION}`}
	/>
</svelte:head>

<GeneratorLayout>
	<h1>Regular polygon</h1>
	<p>
		Generate anything from a triangle to an <a href="https://en.wikipedia.org/wiki/Icosagon"
			>icosagon</a
		>. Then make it less regular if you want!
	</p>
	<form>
		<label for="sides">Number of sides:</label>
		<input id="sides" type="number" bind:value={sides} min="3" max="20" />

		<label for="radius">Radius:</label>
		<input id="radius" type="text" bind:value={radius} />

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

		<label for="swell">Swell:</label>
		<input
			id="swell"
			type="range"
			bind:value={swell}
			min="0"
			max="2"
			step="0.01"
			list="swell-ticks"
		/>
		<datalist id="swell-ticks">
			<option value="0"></option>
			<option value="1"></option>
			<option value="2"></option>
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
