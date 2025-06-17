<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import Button from './Button.svelte';
	import { copyTextToClipboard } from './copyTextToClipboard';

	const { cssProperties }: { cssProperties: Record<string, string> } = $props();

	let codeElement: HTMLElement;
</script>

<code bind:this={codeElement}
	>{#each Object.entries(cssProperties) as [key, value] (key)}<span class="property">{key}</span>:
		<span class="key">{value}</span>;&#13;&#10;{/each}</code
>
<div class="copy">
	<Button size="small" onclick={() => copyTextToClipboard(codeElement)} popovertarget="copied">
		{#snippet icon()}
			<Copy size={16} />
		{/snippet}
		Copy to clipboard
	</Button>
</div>
<div id="copied" popover onanimationend={(e) => e.currentTarget.hidePopover()}>
	<Check />
	Copied!
</div>

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

	.copy {
		position: absolute;
		position-anchor: --css-output;
		inset-block-start: anchor(start);
		inset-inline-end: anchor(end);
		margin: 0.5rem;
		anchor-name: --copy;
	}

	#copied:popover-open {
		position: absolute;
		position-anchor: --copy;
		position-area: block-start;
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin: 1em;
		padding: 0.5em;

		background-color: var(--jade);
		border: 2px solid transparent;
		border-radius: 0.5rem;
		color: var(--linen);

		animation: fade-in-out 3s forwards;
	}

	@keyframes fade-in-out {
		0% {
			opacity: 0;
			translate: 0 1rem;
		}

		5%,
		75% {
			opacity: 1;
			translate: none;
		}

		100% {
			opacity: 0;
		}
	}
</style>
