<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { cssPropertiesToCss } from '$lib/css';
	import CssOutput from '$lib/CssOutput.svelte';
	import GeneratorLayout from '$lib/GeneratorLayout.svelte';
	import { percent, px } from '$lib/LengthPercentage';
	import { Squircle } from '$lib/parametricShapes/Squircle';

	let curvature = $state(0.25);
	let proportional = $state(true);

	const squircle = $derived(
		new Squircle(
			proportional ? percent(Math.round(curvature * 50)) : px(Math.round(curvature * 100))
		)
	);
	const cssProperties = $derived(squircle.toCssProperties('clip-path'));
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

		<label for="proportional">Proportional curvature:</label>
		<input id="proportional" type="checkbox" bind:checked={proportional} />
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

	input[type='checkbox'] {
		justify-self: start;
	}

	.preview {
		background-color: var(--jade);
		width: 300px;
		height: 300px;
		max-width: 100%;
	}
</style>
