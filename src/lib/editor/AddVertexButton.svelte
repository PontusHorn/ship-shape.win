<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { disableUntilHydrated } from '../util/disableUntilHydrated';
	import type { Vector } from '../util/vector';
	import type { VertexPosition } from './VertexPosition';

	type Props = HTMLButtonAttributes & {
		position: VertexPosition;
		maxSize: Vector;
		onAddVertex: () => void;
	};

	const { position, onAddVertex, maxSize, ...props }: Props = $props();
</script>

<div
	class="midpoint"
	style:translate={`${position.x.toPixels(maxSize[0])}px ${position.y.toPixels(maxSize[1])}px`}
>
	<button onclick={onAddVertex} {...disableUntilHydrated()} {...props}>
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
		z-index: 1;
	}

	button {
		all: unset;
		position: absolute;
		width: 20px;
		height: 20px;
		display: flex;
		align-items: center;
		justify-content: center;

		--_surface: var(--editorButton-color-surface);
		--_detail: var(--editorButton-color-detail);
		background-color: var(--_surface);
		border: 2px solid var(--_detail);
		border-radius: 50%;
		color: var(--_detail);
		translate: -50% -50%;
		opacity: 0;
		scale: 0.8;
		transition:
			opacity 0.2s ease-in-out,
			scale 0.2s ease-in-out,
			background-color 0.1s ease-in-out,
			box-shadow 0.1s ease-in-out,
			color 0.1s ease-in-out;

		&:hover,
		&:focus-visible {
			opacity: 1;
			scale: 1;
			--_surface: var(--editorButton-color-surface-interest);
			--_detail: var(--editorButton-color-detail-interest);
		}

		&:focus-visible,
		&:active {
			box-shadow:
				0 0 0 2px var(--_surface),
				0 0 0 4px var(--_detail);
			outline: none;
		}

		&:active {
			--_surface: var(--editorButton-color-surface-active);
			--_detail: var(--editorButton-color-detail-active);
		}
	}
</style>
