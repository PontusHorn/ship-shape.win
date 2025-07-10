<script lang="ts">
	import { disableUntilHydrated } from './disableUntilHydrated';
	import type { Vector } from './vector';
	import type { VertexPosition } from './VertexPosition';

	type Props = {
		position: VertexPosition;
		maxSize: Vector;
		onAddVertex: () => void;
	};

	const { position, onAddVertex, maxSize }: Props = $props();
</script>

<div
	class="midpoint"
	style:left={position.x.toCss(maxSize[0])}
	style:top={position.y.toCss(maxSize[1])}
>
	<button onclick={onAddVertex} {...disableUntilHydrated()}>
		<span class="visually-hidden">
			Insert vertex at
			{position.x.toCss(maxSize[0], 'minimal')},
			{position.y.toCss(maxSize[1], 'minimal')}
		</span>
		<svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
			<path d="M6 2V10M2 6H10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
	</button>
</div>

<style>
	.midpoint {
		position: absolute;
		left: 0;
		top: 0;
	}

	button {
		all: unset;
		position: absolute;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;

		border-radius: 50%;
		background-color: var(--pistachio);
		border: 2px solid var(--fjord);
		color: var(--fjord);
		translate: -50% -50%;
		opacity: 0;
		scale: 0.8;
		transition:
			opacity 0.2s ease-in-out,
			scale 0.2s ease-in-out,
			box-shadow 0.1s ease-in-out,
			filter 0.1s ease-in-out;

		&:hover,
		&:focus {
			opacity: 1;
			scale: 1;
			filter: brightness(1.1) saturate(1.2);
		}

		&:focus {
			box-shadow:
				0 0 0 2px var(--pistachio),
				0 0 0 4px var(--fjord);
			outline: none;
		}
	}
</style>
