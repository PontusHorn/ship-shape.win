<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import CssOutput from '$lib/CssOutput.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import type { BaseUnit } from '$lib/LengthPercentage';
	import { outputConfig } from '$lib/outputConfig.svelte';
	import { Squircle } from '$lib/parametricShapes/Squircle';
	import ShapePreview from '$lib/ShapePreview.svelte';

	let curvature = $state(0.25);
	let unit = $state<BaseUnit>('percent');

	const squircle = $derived(
		new Squircle(
			unit,
			unit === 'percent' ? Math.round(curvature * 50) : Math.round(curvature * 100)
		)
	);
	const shape = $derived(squircle.toShape(outputConfig.previewSize));
	const cssProperties = $derived(squircle.toCssProperties(outputConfig));
</script>

<svelte:head>
	<title>Squircle shape() generator - {SITE_TITLE}</title>
	<meta
		name="description"
		content={`Make a fancy little squircley shape for your fancy little website. ${SITE_DESCRIPTION}`}
	/>
</svelte:head>

<GeneratorLayout>
	<h1>Squircle</h1>
	<p>
		It's squircle! Can't imagine a more beautiful thing. Make a fancy little squircley shape for
		your fancy little website.
	</p>
	<form>
		<label for="curvature">Curvature:</label>
		<input
			id="curvature"
			type="range"
			bind:value={curvature}
			min="0"
			max="1"
			step="0.01"
			list="curvature-ticks"
		/>
		<datalist id="curvature-ticks">
			<option value="0"></option>
			<option value="0.25"></option>
			<option value="0.5"></option>
			<option value="0.75"></option>
			<option value="1"></option>
		</datalist>

		<label for="unit" class="visually-hidden">Unit:</label>
		<select id="unit" bind:value={unit}>
			<option value="percent">%</option>
			<option value="px">px</option>
		</select>
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
</style>
