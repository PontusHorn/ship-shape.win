<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/Button.svelte';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import CssOutput from '$lib/CssOutput.svelte';
	import { editor } from '$lib/editor/Editor.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import type { BaseUnit } from '$lib/LengthPercentage';
	import { outputConfig } from '$lib/outputConfig.svelte';
	import { Squircle } from '$lib/parametricShapes/Squircle';
	import ShapePreview from '$lib/ShapePreview.svelte';
	import { disableUntilHydrated } from '$lib/util/disableUntilHydrated';

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

	<!-- Valid warning, will sort out in a later version -->
	{@html `<!-- [html-validate-disable-next wcag/h32] -->`}
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
		grid-template-columns: auto 1fr 1fr;
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
