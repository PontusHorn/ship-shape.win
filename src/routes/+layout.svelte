<script lang="ts">
	import './reset.css';
	import './tokens.css';
	import './core.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import { ChevronDown, GithubIcon } from '@lucide/svelte';

	let { children } = $props();

	// Enable view transitions on client-side navigations
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<header>
	<a href="#main-content" class="skip-link">Skip to main content</a>

	<div class="site-title">
		<a href="/">
			<span class="icon" aria-hidden="true">⚓︎</span>
			ship-shape<span class="parenthesis">&hairsp;(&hairsp;</span><span class="win">.win</span><span
				class="parenthesis">&hairsp;)</span
			>
		</a>
	</div>

	<nav>
		<button type="button" popovertarget="shapes">
			Shapes <ChevronDown aria-hidden="true" absoluteStrokeWidth />
		</button>
		<div id="shapes" popover>
			<a
				href="/generators/regular-polygon"
				aria-current={page.url.pathname === '/generators/regular-polygon'}
			>
				Regular polygon
			</a>
			<a href="/generators/star" aria-current={page.url.pathname === '/generators/star'}> Star </a>
			<a href="/generators/squircle" aria-current={page.url.pathname === '/generators/squircle'}>
				Squircle
			</a>
		</div>

		<a href="/editor" aria-current={page.url.pathname === '/editor'}>Editor</a>
	</nav>
</header>

<main id="main-content">
	<div class="browser-shape-support-warning">
		Your browser does not support the <code>shape()</code> function, which means you won't be able to
		see the shapes as intended.
	</div>
	{@render children()}
</main>

<footer>
	<p>Made by <a href="https://pontushorn.me">Pontus Horn</a>. Use the output however you like!</p>

	<div class="links">
		<a href="https://github.com/PontusHorn/ship-shape.win">
			<GithubIcon aria-hidden="true" absoluteStrokeWidth />
			GitHub repository
		</a>
	</div>
</footer>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--brand-600);
		box-shadow: 1px 2px 4px var(--brand-300);
		color: var(--brand-050);
		padding: 1rem;
		gap: 1rem;
		--focusRingColor: var(--secondary-100);

		@media (max-width: 400px) {
			flex-direction: column;
		}
	}

	.skip-link {
		position: absolute;
		top: 1rem;
		left: 50%;
		padding-block: 0.2em;
		padding-inline: 0.4em;

		border-radius: 0.5rem;
		color: var(--brand-050);
		font-weight: 500;
		opacity: 0;
		text-underline-offset: 0.2em;
		text-decoration-color: color-mix(in srgb, currentColor 80%, transparent);
		transform: translateX(-50%);
		translate: 0 -110%;
		transition:
			opacity 0.2s ease-in,
			translate 0.2s ease-in;

		&:focus {
			opacity: 1;
			text-decoration-color: currentColor;
			text-decoration-thickness: 0.15em;
			transition:
				opacity 0.35s ease-out,
				translate 0.7s var(--softSpring);
			translate: 0 0;
		}

		@media (max-width: 600px) {
			font-size: var(--fontSize-0);
		}
	}

	.site-title {
		font-size: var(--fontSize-2);

		a {
			color: inherit;
			--_decorationColor: color-mix(in srgb, currentColor 50%, transparent);
			text-underline-offset: 0.2em;
			text-decoration-color: var(--_decorationColor);

			&:hover,
			&:focus-visible {
				--_decorationColor: currentColor;
			}
		}

		.parenthesis {
			color: var(--_decorationColor);
		}

		.win {
			font-size: var(--fontSize-0);
		}

		@media (max-width: 600px) {
			font-size: var(--fontSize-1);
		}
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;

		> a,
		> button {
			display: flex;
			align-items: center;
			gap: 0.125em;
			background: transparent;
			padding-block: 0.2em;
			padding-inline: 0.4em;
			border-radius: 0.5rem;
			color: inherit;
			font-weight: 500;
			text-underline-offset: 0.2em;
			text-decoration-color: color-mix(in srgb, currentColor 80%, transparent);

			&:hover,
			&:focus-visible {
				text-decoration-color: currentColor;
				text-decoration-thickness: 0.15em;
			}

			&[aria-current='true'] {
				background-color: var(--brand-100);
				color: var(--brand-700);
				text-decoration: none;
			}

			@media (max-width: 600px) {
				font-size: var(--fontSize-0);
			}
		}

		> button {
			transition: background-color 0.1s ease;

			&:hover,
			&:focus-visible {
				background-color: var(--brand-700);
			}
		}

		[popovertarget] {
			/* The extra white-space in the chevron icon makes the spacing look
			unbalanced, so adjust the padding slightly on that side */
			padding-inline-end: 0.2rem;
		}

		[popover] {
			position: fixed;
			position-area: end span-start;
			margin-block: 0.2em;
			margin-inline: 0;
			padding: 0.5rem;

			background: var(--brand-100);
			border: 4px solid var(--brand-800);
			border-radius: 0.5rem;
			box-shadow:
				1px 2px 4px color-mix(in srgb, var(--brand-950) 15%, transparent),
				0.5px 1px 2px color-mix(in srgb, var(--brand-950) 25%, transparent);
			--_duration: 0.75s;
			transition:
				display var(--_duration) allow-discrete,
				overlay var(--_duration) allow-discrete,
				opacity var(--_duration) var(--softSpring),
				transform var(--_duration) var(--softSpring);
			opacity: 0;
			transform: translate(0, -0.5rem) scaleY(0.95);
			transform-origin: top center;
			--focusRingColor: var(--secondary-700);

			/* Estimate an OK position when anchor positioning is not supported */
			@supports not (position-area: start start) {
				inset: auto;
				right: 5.2em;
				top: 2.8em;
			}

			&:popover-open {
				opacity: 1;
				transform: none;

				@starting-style {
					opacity: 0;
					transform: translate(0, -0.5rem) scaleY(0.8);
				}
			}

			@media (prefers-reduced-motion: reduce) {
				&,
				&:popover-open {
					transform: none;
				}
			}

			a {
				display: block;
				padding-block: 0.2em;
				padding-inline: 0.4em;
				border-radius: 0.15rem;
				color: var(--linkColor-visited);
				font-weight: 500;
				outline-offset: 0.1em;

				&:hover,
				&:focus-visible {
					text-decoration-color: currentColor;
					text-decoration-thickness: 0.15em;
				}

				&:visited {
					color: var(--linkColor-visited);
				}

				&[aria-current='true'] {
					background-color: var(--brand-600);
					color: var(--brand-050);
					text-decoration: none;
				}
			}
		}
	}

	.browser-shape-support-warning {
		display: none;
		background-color: var(--error-400);
		color: var(--error-950);
		padding: 1rem;
		text-align: center;

		@supports not (clip-path: shape(from 0 0, line to 100% 100%)) {
			display: block;
		}
	}

	footer {
		padding-block: 4rem 2rem;
		padding-inline: 1rem;
		text-align: center;

		p {
			margin-block: 1rem;
		}

		.links a {
			display: flex;
			gap: 0.25rem;
			inline-size: fit-content;
			margin-inline: auto;

			:global(svg) {
				stroke: currentColor;
			}
		}
	}
</style>
