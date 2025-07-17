<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		isOpen: boolean;
		onClose: () => void;
	};

	const { children, isOpen, onClose }: Props = $props();

	let popover: HTMLElement | null;

	$effect(() => {
		if (isOpen) {
			popover?.showPopover();
		}
	});
</script>

<div
	role="alert"
	class="error"
	bind:this={popover}
	popover="auto"
	ontoggle={(event) => {
		if (event.newState === 'closed') {
			onClose?.();
		}
	}}
>
	{@render children()}
</div>

<style>
	.error:popover-open {
		position: absolute;
		position-anchor: --vertex;
		position-area: block-start;
		position-try: block-start, flip-block, inline-end, flip-inline;
		margin: 2rem;
		max-inline-size: 30ch;
		padding-block: 0.3rem;
		padding-inline: 0.5rem;
		/* Need to inherit the vertex translation for correct positioning */
		translate: inherit;

		background-color: var(--error-300);
		border: 2px solid var(--error-950);
		border-radius: 0.5rem;
		color: var(--error-950);
	}
</style>
