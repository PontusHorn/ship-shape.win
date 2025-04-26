<script lang="ts">
	import { close } from '$lib/commands/Close';
	import { from } from '$lib/commands/From';
	import { lineTo } from '$lib/commands/Line';
	import { percent } from '$lib/LengthPercentage';
	import { Shape } from '$lib/Shape';

	const shape = $state(
		new Shape(from(percent(50), percent(0)), [
			lineTo(percent(100), percent(50)),
			lineTo(percent(50), percent(100)),
			lineTo(percent(0), percent(50)),
			close()
		])
	);
</script>

<div style:clip-path={shape.toString()}></div>

<style>
	:global(body) {
		place-items: center;
		place-content: center;
		min-block-size: 100vh;
	}

	div {
		background-color: #67803f;
		width: 300px;
		height: 300px;
	}
</style>
