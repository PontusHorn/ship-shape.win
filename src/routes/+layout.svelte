<script lang="ts">
	import './reset.css';
	import './core.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';

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
		<button popovertarget="shapes">Shapes ▾</button>
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
	Made by <a href="https://pontushorn.me">Pontus Horn</a>. Use the output however you like!
</footer>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: var(--midnight);
		color: var(--linen);
		padding: 1rem;
		gap: 1rem;

		@media (max-width: 400px) {
			flex-direction: column;
		}
	}

	.site-title {
		font-size: var(--fontSize-2);

		a {
			color: inherit;
			--decoration-color: color-mix(in srgb, currentColor 50%, transparent);
			text-underline-offset: 0.2em;
			text-decoration-color: var(--decoration-color);

			&:hover,
			&:focus-visible {
				--decoration-color: currentColor;
			}
		}

		.parenthesis {
			color: var(--decoration-color);
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
			background: transparent;
			padding-block: 0.2em;
			padding-inline: 0.25em;
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
				background-color: var(--linen);
				color: var(--midnight);
				text-decoration: none;
			}

			@media (max-width: 600px) {
				font-size: var(--fontSize-0);
			}
		}

		[popovertarget] {
			anchor-name: --dropdown;
		}

		[popover] {
			position: fixed;
			position-anchor: --dropdown;
			position-area: end span-start;
			margin: 0;
			padding: 1rem;

			background: var(--linen);
			border: 4px solid var(--midnight);
			border-radius: 0.5rem;
			--duration: 0.75s;
			transition:
				display var(--duration) allow-discrete,
				overlay var(--duration) allow-discrete,
				opacity var(--duration) var(--softSpring),
				transform var(--duration) var(--softSpring);
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
				color: var(--link);
				font-weight: 500;

				&:visited {
					color: var(--linkVisited);
				}
			}
		}
	}

	footer {
		padding-block: 4rem 2rem;
		padding-inline: 1rem;
		text-align: center;
	}
</style>
