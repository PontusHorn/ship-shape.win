<script lang="ts">
	import { copyTextToClipboard } from './copyTextToClipboard';

	const { cssProperties }: { cssProperties: Record<string, string> } = $props();

	let codeElement: HTMLElement;
</script>

<code bind:this={codeElement}
	>{#each Object.entries(cssProperties) as [key, value] (key)}<span class="property">{key}</span>:
		<span class="key">{value}</span>;&#13;&#10;{/each}</code
>
<button onclick={() => copyTextToClipboard(codeElement)}>Copy to clipboard</button>

<style>
	code {
		display: block;
		background-color: var(--fjord);
		color: var(--linen);
		padding: 1rem;
		border-radius: 0.5rem;
		paint-order: stroke fill;
		overflow: auto;
		tab-size: 2;
		white-space: pre;
		anchor-name: --css-output;
	}

	.property {
		color: oklch(0.95 0.07 180.81);
		font-weight: bold;
	}

	.key {
		color: oklch(0.92 0.07 344.04);
	}

	button {
		position: absolute;
		position-anchor: --css-output;
		inset-block-start: anchor(start);
		inset-inline-end: anchor(end);
		margin: 0.5rem;

		/* Flash a green inset box-shadow covering the button as confirmation */
		transition: box-shadow 1s 3s ease-in;
		box-shadow: inset 0 0 0 3em transparent;
	}

	button:active {
		box-shadow: inset 0 0 0 3em rgb(0 255 0 / 0.25);
		/* Make the transition instant as you click, so that it only fades out
		slowly afterwards */
		transition: none;
	}
</style>
