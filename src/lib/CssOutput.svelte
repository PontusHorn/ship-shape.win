<script lang="ts">
	const { cssProperties }: { cssProperties: Record<string, string> } = $props();
</script>

<svelte:head>
	<script type="module" src="/elements/copy-button.js"></script>
</svelte:head>

<code id="css-output"
	>{#each Object.entries(cssProperties) as [key, value]}<span class="property">{key}</span>:
		<span class="key">{value}</span>;{'\n'}{/each}</code
>
<copy-button target="css-output"></copy-button>

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
