<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { CoordinatePair } from '$lib/CoordinatePair';
	import { cssPropertiesToCss } from '$lib/css';
	import CssOutput from '$lib/CssOutput.svelte';
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
	<script type="module" src="/elements/copy-button.js"></script>
</svelte:head>

<main>
	<div class="input-pane">
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
	</div>

	<div class="preview-pane">
		<div class="preview" style={cssPropertiesToCss(cssProperties)}></div>
	</div>

	<div class="output-pane">
		<CssOutput {cssProperties} />
	</div>
</main>

<style>
	main {
		display: grid;
		grid-template-areas:
			'input preview'
			'output output';
		grid-template-columns: min(50ch, 50%) 1fr;
		min-block-size: 100vh;
		padding: 1rem;
		gap: 1rem;
	}

	.input-pane {
		grid-area: input;
		display: grid;
		align-content: start;
		gap: 1rem;
	}

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

	.preview-pane {
		grid-area: preview;
		display: grid;
		place-items: center;
		place-content: center;
		padding: 2rem;

		background: var(--pistachio);
		border-radius: 0.5rem;
		box-shadow: inset 1px 2px 4px rgb(0 0 0 / 0.05);
	}

	.preview {
		background-color: var(--jade);
		width: 300px;
		height: 300px;
	}

	.output-pane {
		grid-area: output;
	}
</style>
