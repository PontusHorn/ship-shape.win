<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		children,
		icon,
		size = 'normal',
		...restProps
	}: HTMLButtonAttributes & { size?: 'small' | 'normal'; icon?: Snippet } = $props();
</script>

<button {...restProps} class={size}>
	{#if icon}
		<span class="icon">{@render icon()}</span>
	{/if}
	{@render children?.()}
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin-block-end: 0.75em;
		padding-block: 0.5em;
		padding-inline: 0.7em;

		--_lightness: var(--lightness, 0.92);
		--_chroma: var(--chroma, 0.07);
		--_hue: var(--hue, 238.85);
		--_color: oklch(var(--_lightness) var(--_chroma) var(--_hue));
		background: var(--_color) linear-gradient(155deg, rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.1));
		background-blend-mode: luminosity;
		color: color-mix(in srgb, var(--_color), black 75%);
		font-weight: 600;

		box-shadow:
			inset -3px -3px 10px -2px color-mix(in srgb, var(--_color), rgb(255 255 255 / 0.3)),
			inset 1px 1px 2px color-mix(in srgb, var(--_color), rgb(255 255 255 / 0.5)),
			inset -1px -1px 2px color-mix(in srgb, var(--_color), rgb(0 0 0 / 0.5)),
			inset 3px 3px 10px -2px color-mix(in srgb, var(--_color), rgb(0 0 0 / 0.15));
		letter-spacing: 0.01em;
		transform-style: preserve-3d;

		--_duration: 100ms;
		--_easing: cubic-bezier(0, 0, 0.58, 1);
		transition:
			transform var(--_duration) var(--_easing),
			background var(--_duration) var(--_easing);

		--_border-color: color-mix(in srgb, var(--_color), black 50%);
		--_radius-start: 0.75em;
		--_radius-end: 0.75em;
		border: 2px solid var(--_border-color);
		border-start-start-radius: max(3px, var(--_radius-start));
		border-end-start-radius: max(4px, var(--_radius-start));
		border-start-end-radius: max(3px, var(--_radius-end));
		border-end-end-radius: max(4px, var(--_radius-end));

		--_depth: 1;
		--_pressedness: 0em;
		transform: translate(0em, var(--_pressedness));

		--_shade-left: rgb(255 255 255 / 0.1);
		--_shade-bottom: rgb(0 0 0 / 0.2);
		--_shade-right: rgb(0 0 0 / 0.3);

		/* Smush adjacent buttons together */
		&:nth-child(n + 2 of button) {
			margin-inline-start: -2px;
			--_radius-start: 2px;
			--_shade-left: rgb(0 0 0 / 0.4);
		}
		&:nth-last-child(n + 2 of button) {
			--_radius-end: 2px;
			--_shade-right: rgb(0 0 0 / 0.5);
		}

		&::before {
			position: absolute;
			content: '';
			width: 100%;
			height: 100%;
			inset: 0;
			background: var(--_color)
				linear-gradient(
					to right,
					var(--_shade-left),
					var(--_shade-bottom) var(--_radius-start),
					var(--_shade-bottom) calc(100% - var(--_radius-end)),
					var(--_shade-right)
				);
			background-blend-mode: luminosity;
			border-start-start-radius: var(--_radius-start);
			border-end-start-radius: var(--_radius-start);
			border-start-end-radius: var(--_radius-end);
			border-end-end-radius: var(--_radius-end);
			box-shadow:
				0 0 0 2px color-mix(in srgb, var(--_border-color), black 10%),
				0.5px 1px 1px 3px color-mix(in srgb, var(--abyss), transparent 90%),
				1px 2px 3px 3px color-mix(in srgb, var(--abyss), transparent 95%);
			transform: translate3d(0, calc((0.75em - var(--_pressedness)) * var(--_depth)), -1em);
			transition:
				transform var(--_duration) var(--_easing),
				box-shadow var(--_duration) var(--_easing);
		}

		&:hover,
		&:focus-visible {
			background-color: color-mix(in srgb, var(--_color), var(--linen) 25%);
			--_pressedness: 0.05em;
			/* Bring the focus outline to the front */
			z-index: 1;
		}

		&:is([aria-checked='true'], [aria-pressed='true']) {
			--_hue: 150;
			color: color-mix(in srgb, var(--_color), black 85%);
			text-shadow: 0 0 4px color-mix(in srgb, var(--_color), white 75%);
			--_pressedness: 0.4em;
			--_duration: 150ms;
		}

		&:active {
			--_pressedness: 0.7em;
			--_duration: 150ms;
		}

		&:is([aria-checked='true'], [aria-pressed='true']):active {
			--_pressedness: 0.45em;
		}

		&:disabled {
			--_lightness: 0.95;
			--_chroma: 0.02;
			--_border-color: color-mix(in srgb, var(--_color), rgb(0 0 0 / 0.5) 30%);
			color: color-mix(in srgb, var(--_color), black 60%);
		}

		&:disabled:active:not([aria-checked='true'], [aria-pressed='true']) {
			--_pressedness: 0.1em;
		}

		&.small {
			--_depth: 0.75;
			padding-block: 0.3em;
			padding-inline: 0.5em;
			font-size: var(--fontSize--1);
		}
	}
</style>
