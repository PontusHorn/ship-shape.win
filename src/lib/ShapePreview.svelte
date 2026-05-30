<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cssDeclarationBlockToCss, type CssDeclarationBlock } from './util/css';
	import {
		BORDERED_SHAPE_CLASS_NAME,
		CLIPPED_SHAPE_CLASS_NAME,
		getSvgPath,
		PATH_FOLLOWER_CLASS_NAME
	} from './util/output';
	import { outputConfig } from './outputConfig.svelte';
	import type { Shape } from './Shape';

	type Props = {
		cssDeclarationBlock: CssDeclarationBlock;
		shape: Shape;
		children?: Snippet;
	};

	const { cssDeclarationBlock, shape, children }: Props = $props();

	const css = $derived(cssDeclarationBlockToCss(cssDeclarationBlock));
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
		<div class="arrow {PATH_FOLLOWER_CLASS_NAME}"></div>
	{:else if outputConfig.shapeProperty === 'border-shape'}
		<div class="bordered {BORDERED_SHAPE_CLASS_NAME}"></div>
	{:else}
		<div class="clipped {CLIPPED_SHAPE_CLASS_NAME}"></div>
	{/if}

	{@render children?.()}
</div>

<svelte:head>
	{@html `<style>${css}</style>`}
</svelte:head>

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

	.clipped {
		background-color: var(--brand-400);
		width: 100%;
		height: 100%;
		/* Add a faint outline that shows when the clip-path extends outside the
		element bounds, so it's easier to see the path */
		outline: 9999px solid color-mix(in srgb, var(--brand-400), transparent 90%);
	}

	.bordered {
		background-color: var(--brand-100);
		border: 4px solid var(--brand-400);
		box-shadow: 0.1em 0.2em 0.15em 0.1em color-mix(in srgb, var(--neutral-950), transparent 90%);
		width: 100%;
		height: 100%;
	}
</style>
