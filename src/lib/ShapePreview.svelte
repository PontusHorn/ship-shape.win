<script lang="ts">
	import { cssPropertiesToCss, type CssProperties } from './css';
	import { getSvgPath, OFFSET_PATH_KEYFRAMES } from './output';
	import { outputConfig } from './outputConfig.svelte';
	import type { Shape } from './Shape';

	type Props = {
		cssProperties: CssProperties;
		shape: Shape;
	};

	const { cssProperties, shape }: Props = $props();

	const css = $derived(cssPropertiesToCss(cssProperties));
</script>

<div
	class="preview"
	style:width={outputConfig.previewSize[0] + 'px'}
	style:height={outputConfig.previewSize[1] + 'px'}
>
	{#if outputConfig.shapeProperty === 'offset-path'}
		<svg class="offsetPath" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path
				d={getSvgPath(shape)}
				fill="none"
				stroke="color-mix(in srgb, var(--jade), transparent 50%)"
				stroke-width="2"
				stroke-dasharray="5 5"
				vector-effect="non-scaling-stroke"
			/>
		</svg>
		<div class="arrow" style={css}></div>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<style>${OFFSET_PATH_KEYFRAMES}</style>`}
	{:else}
		<div class="clippedShape" style={css}></div>
	{/if}
</div>

<style>
	.preview {
		position: relative;
	}

	.offsetPath {
		position: absolute;
		inset: 0;
		border: 2px dotted color-mix(in srgb, var(--limestoned), transparent 50%);
		overflow: visible;
	}

	.arrow {
		background-color: var(--jade);
		width: 40px;
		height: 40px;
		clip-path: shape(from 0% 10%, line to 100% 50%, line to 0% 90%, line to 10% 50%, close);
	}

	.clippedShape {
		background-color: var(--jade);
		width: 100%;
		height: 100%;
		/* Add a faint outline that shows when the clip-path extends outside the
		element bounds, so it's easier to see the path */
		outline: 9999px solid color-mix(in srgb, var(--jade), transparent 90%);
	}
</style>
