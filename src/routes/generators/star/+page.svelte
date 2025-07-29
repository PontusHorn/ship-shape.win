<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import CssOutput from '$lib/CssOutput.svelte';
	import { editor } from '$lib/editor/Editor.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import type { BaseUnit } from '$lib/LengthPercentage';
	import { outputConfig } from '$lib/outputConfig.svelte';
	import { StarPolygon } from '$lib/parametricShapes/StarPolygon';
	import ShapePreview from '$lib/ShapePreview.svelte';
	import { disableUntilHydrated } from '$lib/util/disableUntilHydrated';
	import type { Vector } from '$lib/util/vector';

	let points = $state(6);
	let unit = $state<BaseUnit>('percent');
	let outerRadius = $state(50);
	let innerRadius = $state(20);
	let rotation = $state(0);
	let center = $derived<Vector>(unit === 'percent' ? [50, 50] : [150, 150]);
	const polygon = $derived(
		new StarPolygon(points, unit, outerRadius, innerRadius, center, rotation)
	);

	const shape = $derived(polygon.toShape());
	let cssProperties = $derived(polygon.toCssProperties(outputConfig));
</script>

<svelte:head>
	<title>Star shape() generator - {SITE_TITLE}</title>
	<meta name="description" content={`Generates that most pointy of shapes. ${SITE_DESCRIPTION}`} />
</svelte:head>

<GeneratorLayout>
	<h1>Star polygon</h1>
	<p>Generates that most pointy of shapes.</p>

	<!-- Valid warning, will sort out in a later version -->
	{@html `<!-- [html-validate-disable-next wcag/h32] -->`}
	<form>
		<label for="points">Number of points:</label>
		<input id="points" type="number" bind:value={points} min="3" />

		<label for="unit">Unit:</label>
		<select id="unit" bind:value={unit}>
			<option value="percent">%</option>
			<option value="px">px</option>
		</select>

		<label for="outer-radius">Outer radius:</label>
		<input id="outer-radius" type="number" bind:value={outerRadius} />

		<label for="inner-radius">Inner radius:</label>
		<input id="inner-radius" type="number" bind:value={innerRadius} />

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

	<div class="actions">
		<Button
			{...disableUntilHydrated()}
			type="button"
			size="small"
			onclick={() => {
				editor.drawing = shape.toDrawing(outputConfig.previewSize);
				goto('/editor');
			}}
		>
			Open in editor
		</Button>
	</div>

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
		grid-template-columns: auto 1fr;
		align-items: baseline;
		align-content: start;
		gap: 0.5rem 0.25rem;
	}

	label {
		text-align: right;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
		justify-content: end;
	}
</style>
