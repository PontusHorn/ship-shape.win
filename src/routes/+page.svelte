<script lang="ts">
	import { CoordinatePair } from '$lib/CoordinatePair';
	import { percent, raw } from '$lib/LengthPercentage';
	import { RegularPolygon } from '$lib/parametricShapes/RegularPolygon';

	let sides = $state(6);
	let radius = $state('50%');
	let rotation = $state(0);
	const center = new CoordinatePair(percent(50), percent(50));
	const polygon = $derived(new RegularPolygon(sides, raw(radius), center, rotation));
	const cssString = $derived(polygon.toCSS('clip-path'));
</script>

<svelte:head>
	<script type="module" src="/elements/copy-button.js"></script>
</svelte:head>

<main>
	<div class="preview" style={cssString}></div>

	<form>
		<label for="sides">Number of sides:</label>
		<input id="sides" type="number" bind:value={sides} min="3" max="20" />
		<label for="radius">Radius:</label>
		<input id="radius" type="text" bind:value={radius} />
		<label for="rotation">Rotation:</label>
		<input id="rotation" type="range" bind:value={rotation} min="0" max="1" step="0.01" />
	</form>

	<output>
		<pre id="css-output">{cssString}</pre>
	</output>
	<copy-button target="css-output"></copy-button>
</main>

<style>
	main {
		display: grid;
		place-items: center;
		place-content: center;
		min-block-size: 100vh;
		gap: 1rem;
	}

	.preview {
		background-color: #67803f;
		width: 300px;
		height: 300px;
	}

	form {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: baseline;
		gap: 0.5rem 0.25rem;
	}

	label {
		text-align: right;
	}

	pre {
		background-color: #333;
		color: #fafafa;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow: auto;
		inline-size: 80dvw;
		tab-size: 2;
		anchor-name: --css-output;
	}

	copy-button::part(button) {
		position: absolute;
		position-anchor: --css-output;
		inset-block-end: anchor(end);
		inset-inline-end: anchor(end);
		margin: 0.5rem;

		/* Flash a green inset box-shadow covering the button as confirmation */
		transition: box-shadow 1s 3s ease-in;
		box-shadow: inset 0 0 0 3em transparent;
	}

	copy-button::part(button):active {
		box-shadow: inset 0 0 0 3em rgb(0 255 0 / 0.25);
		/* Make the transition instant as you click, so that it only fades out
		slowly afterwards */
		transition: none;
	}
</style>
