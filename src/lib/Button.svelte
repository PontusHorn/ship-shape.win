<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		children,
		icon,
		size = 'normal',
		...restProps
	}: HTMLButtonAttributes & {
		// Require the `type` attribute to be specified
		type: NonNullable<HTMLButtonAttributes['type']>;
		size?: 'small' | 'normal';
		icon?: Snippet;
	} = $props();
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

		--_backgroundColor: var(--backgroundColor, var(--brand-300));
		--_textColor: var(--textColor, var(--brand-950));
		--_pressedBackgroundColor: var(--backgroundColor, var(--secondary-300));
		--_pressedTextColor: var(--textColor, var(--secondary-950));

		background: var(--_backgroundColor);
		background-blend-mode: luminosity;
		color: var(--_textColor);
		font-weight: 600;

		letter-spacing: 0.01em;
		transform-style: preserve-3d;

		--_duration: 100ms;
		--_easing: cubic-bezier(0, 0, 0.58, 1);
		--_transformEasing: var(--_easing);
		transition:
			transform var(--_duration) var(--_transformEasing),
			background var(--_duration) var(--_easing),
			--_borderColor var(--_duration) var(--_easing);

		--_borderColorBase: color-mix(in srgb, var(--_backgroundColor), var(--neutral-950) 50%);
		--_borderColor: var(--_borderColorBase);
		--_radiusStart: 0.75em;
		--_radiusEnd: 0.75em;
		border: 2px solid var(--_borderColor);
		border-start-start-radius: max(3px, var(--_radiusStart));
		border-end-start-radius: max(4px, var(--_radiusStart));
		border-start-end-radius: max(3px, var(--_radiusEnd));
		border-end-end-radius: max(4px, var(--_radiusEnd));

		--_depth: 1;
		--_pressedness: 0em;
		transform: translate(0em, var(--_pressedness));

		/* Smush adjacent buttons together */
		&:nth-child(n + 2 of button) {
			margin-inline-start: -2px;
			--_radiusStart: 2px;
		}
		&:nth-last-child(n + 2 of button) {
			--_radiusEnd: 2px;
		}

		&::before {
			position: absolute;
			content: '';
			width: 100%;
			height: 100%;
			inset: 0;
			background: color-mix(in srgb, var(--_backgroundColor), var(--neutral-950) 10%);
			background-blend-mode: luminosity;
			border-start-start-radius: var(--_radiusStart);
			border-end-start-radius: var(--_radiusStart);
			border-start-end-radius: var(--_radiusEnd);
			border-end-end-radius: var(--_radiusEnd);
			box-shadow:
				0 0 0 2px color-mix(in srgb, var(--_borderColor), var(--neutral-950) 10%),
				0.5px 1px 1px 3px color-mix(in srgb, var(--neutral-950), transparent 90%),
				1px 2px 3px 3px color-mix(in srgb, var(--neutral-950), transparent 95%);
			transform: translate3d(0, calc((0.75em - var(--_pressedness)) * var(--_depth)), -1em);
			transition:
				transform var(--_duration) var(--_easing),
				box-shadow var(--_duration) var(--_easing);
		}

		/* Use an additional pseudo-element to improve the hit area */
		&::after {
			position: absolute;
			content: '';
			inset: -3px;
			transform: translate3d(0, calc((0.75em - var(--_pressedness)) * var(--_depth)), -1em);
			transition: transform var(--_duration) var(--_easing);
		}

		&:hover,
		&:focus-visible {
			background-color: color-mix(in srgb, var(--_backgroundColor), var(--neutral-050) 25%);
			--_pressedness: 0.05em;
			/* Bring the focus outline to the front */
			z-index: 2;
		}

		&:is([aria-checked='true'], [aria-pressed='true']) {
			--_backgroundColor: var(--_pressedBackgroundColor);
			--_textColor: var(--_pressedTextColor);
			-webkit-text-stroke: color-mix(in srgb, var(--_pressedTextColor), var(--neutral-050) 50%);
			--_pressedness: 0.4em;
			--_duration: 150ms;
		}

		&:enabled {
			/* Show enabled buttons over disabled ones */
			z-index: 1;
		}

		&:disabled {
			/* Show enabled buttons over disabled ones */
			z-index: 0;
		}

		&:active {
			--_pressedness: 0.7em;
			--_duration: 300ms;
			--_clunk: linear(
				0 0%,
				0.07 1%,
				0.18 6%,
				0.27 16%,
				0.34 27%,
				0.4 39%,
				0.5 48%,
				0.64 54%,
				0.79 57%,
				0.89 62%,
				0.96 69%,
				1 82% 100%
			);

			/* Make the button feel more tactile when you press it */
			--_transformEasing: var(--_clunk);
		}

		&:is([aria-checked='true'], [aria-pressed='true']):active {
			--_pressedness: 0.45em;
		}

		&:disabled {
			--_borderColor: color-mix(in srgb, var(--_borderColorBase), transparent 75%);
			color: color-mix(in srgb, var(--_textColor), transparent 20%);
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

	@property --_borderColor {
		syntax: '<color>';
		initial-value: red;
		inherits: true;
	}
</style>
