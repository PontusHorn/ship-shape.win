<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cssPropertiesToCss, type CssProperties } from './util/css';
	import { getSvgPath, OFFSET_PATH_KEYFRAMES } from './util/output';
	import { outputConfig } from './outputConfig.svelte';
	import type { Shape } from './Shape';

	type Props = {
		cssProperties: CssProperties;
		shape: Shape;
		children?: Snippet;
	};

	const { cssProperties, shape, children }: Props = $props();

	const css = $derived(cssPropertiesToCss(cssProperties));
	const offsetPathStyle = $derived(`<style>${OFFSET_PATH_KEYFRAMES}</style>`);
</script>

<div
	class="preview"
	style:width={outputConfig.previewSize[0] + 'px'}
	style:height={outputConfig.previewSize[1] + 'px'}
>
	{#if outputConfig.shapeProperty === 'offset-path'}
		<svg class="offsetPath" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path d={getSvgPath(shape)} />
		</svg>
		<div class="arrow" style={css}></div>
		{@html offsetPathStyle}
	{:else}
		<div class="clippedShape" style={css}></div>
	{/if}

	{@render children?.()}
</div>

<style>
	.preview {
		position: relative;
	}

	.offsetPath {
		position: absolute;
		inset: 0;
		border: 2px dotted var(--brand-200);
		overflow: visible;

		path {
			fill: none;
			stroke: var(--brand-300);
			stroke-width: 2px;
			stroke-dasharray: 5 5;
			vector-effect: non-scaling-stroke;
		}
	}

	.arrow {
		background-color: var(--brand-500);
		width: 40px;
		height: 40px;
		clip-path: shape(from 0% 10%, line to 100% 50%, line to 0% 90%, line to 10% 50%, close);
	}

	.clippedShape {
		background-color: var(--brand-400);
		width: 100%;
		height: 100%;
		/* Add a faint outline that shows when the clip-path extends outside the
		element bounds, so it's easier to see the path */
		outline: 9999px solid color-mix(in srgb, var(--brand-400), transparent 90%);
	}
</style>
