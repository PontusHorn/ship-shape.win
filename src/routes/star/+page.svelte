<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { CoordinatePair } from '$lib/CoordinatePair';
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
	const cssString = $derived(polygon.toCSS('clip-path'));
</script>

<svelte:head>
	<title>Star shape() generator - {SITE_TITLE}</title>
	<meta name="description" content={`Generates that most pointy of shapes. ${SITE_DESCRIPTION}`} />
	<script type="module" src="/elements/copy-button.js"></script>
</svelte:head>

<main>
	<div class="input-pane">
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
			<input id="rotation" type="range" bind:value={rotation} min="0" max="1" step="0.01" />
		</form>
	</div>

	<div class="preview-pane">
		<div class="preview" style={cssString}></div>
	</div>

	<div class="output-pane">
		<pre id="css-output">{cssString}</pre>
		<copy-button target="css-output"></copy-button>
	</div>
</main>

<style>
	main {
		display: grid;
		grid-template-areas:
			'input preview'
			'output output';
		grid-template-columns: auto 1fr;
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

	pre {
		background-color: var(--fjord);
		color: var(--linen);
		padding: 1rem;
		border-radius: 0.5rem;
		overflow: auto;
		tab-size: 2;
		anchor-name: --css-output;
	}

	copy-button::part(button) {
		position: absolute;
		position-anchor: --css-output;
		inset-block-start: anchor(start);
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
