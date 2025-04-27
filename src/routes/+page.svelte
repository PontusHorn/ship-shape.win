<script lang="ts">
	import { CoordinatePair } from '$lib/CoordinatePair';
	import { percent, raw } from '$lib/LengthPercentage';
	import { RegularPolygon } from '$lib/parametricShapes/RegularPolygon';

	let sides = $state(6);
	let radius = $state('50%');
	let rotation = $state(0);
	const center = new CoordinatePair(percent(50), percent(50));
	const polygon = $derived(new RegularPolygon(sides, raw(radius), center, rotation));
</script>

<main>
	<div class="preview" style:clip-path={polygon.toShape().toString()}></div>

	<form>
		<label for="sides">Number of sides:</label>
		<input id="sides" type="number" bind:value={sides} min="3" max="20" />
		<label for="radius">Radius:</label>
		<input id="radius" type="text" bind:value={radius} />
		<label for="rotation">Rotation:</label>
		<input id="rotation" type="range" bind:value={rotation} min="0" max="1" step="0.01" />
	</form>

	<output>
		<pre>clip-path: {polygon.toShape().toString()};</pre>
	</output>
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
	}
</style>
