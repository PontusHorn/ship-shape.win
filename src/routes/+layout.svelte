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
	<div class="site-title">
		<a href="/">
			<span class="icon" aria-hidden="true">⚓︎</span>
			ship-shape<span class="parenthesis">&hairsp;(&hairsp;</span><span class="win">.win</span><span
				class="parenthesis">&hairsp;)</span
			>
		</a>
	</div>

	<nav>
		<button popovertarget="shapes">Shapes <ChevronDown aria-hidden="true" /></button>
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

{@render children()}

<footer>
	<p>Made by <a href="https://pontushorn.me">Pontus Horn</a>. Use the output however you like!</p>

	<div class="links">
		<a href="https://github.com/PontusHorn/ship-shape.win">
			<GithubIcon aria-hidden="true" />
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

		@media (max-width: 400px) {
			flex-direction: column;
		}

		:focus-visible {
			outline-color: var(--secondary-100);
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
			anchor-name: --dropdown;
			/* The extra white-space in the chevron icon makes the spacing look
			unbalanced, so adjust the padding slightly on that side */
			padding-inline-end: 0.2rem;
		}

		[popover] {
			position: fixed;
			position-anchor: --dropdown;
			position-area: end span-start;
			margin: 0;
			padding: 0.5rem;

			background: var(--brand-100);
			border: 4px solid var(--brand-800);
			border-radius: 0.5rem;
			--_duration: 0.75s;
			transition:
				display var(--_duration) allow-discrete,
				overlay var(--_duration) allow-discrete,
				opacity var(--_duration) var(--softSpring),
				transform var(--_duration) var(--softSpring);
			opacity: 0;
			transform: translate(0, -0.5rem) scaleY(0.95);
			transform-origin: top center;

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
				outline-offset: 0;

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
