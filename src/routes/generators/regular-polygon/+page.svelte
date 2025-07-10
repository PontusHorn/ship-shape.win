<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import CssOutput from '$lib/CssOutput.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import type { BaseUnit } from '$lib/LengthPercentage';
	import { outputConfig } from '$lib/outputConfig.svelte';
	import { RegularPolygon } from '$lib/parametricShapes/RegularPolygon';
	import ShapePreview from '$lib/ShapePreview.svelte';
	import type { Vector } from '$lib/vector';

	let sides = $state(6);
	let unit = $state<BaseUnit>('percent');
	let radius = $state(50);
	let rotation = $state(0);
	let swell = $state(1);
	let center = $derived<Vector>(unit === 'percent' ? [50, 50] : [150, 150]);
	const polygon = $derived(new RegularPolygon(sides, 'percent', radius, center, rotation, swell));

	const shape = $derived(polygon.toShape());
	const cssProperties = $derived(polygon.toCssProperties(outputConfig));
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
		<input id="radius" type="number" bind:value={radius} min="0" />
		<label for="unit" class="visually-hidden">Unit:</label>
		<select id="unit" bind:value={unit}>
			<option value="percent">%</option>
			<option value="px">px</option>
		</select>

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
		<ShapePreview {cssProperties} {shape} />
	{/snippet}

	{#snippet output()}
		<CssOutput {cssProperties} />
	{/snippet}
</GeneratorLayout>

<style>
	form {
		display: grid;
		grid-template-columns: auto 1fr 1fr;
		align-items: baseline;
		align-content: start;
		gap: 0.5rem 0.25rem;
	}

	label {
		text-align: right;
	}

	input:not(#radius) {
		grid-column: span 2;
	}
</style>
