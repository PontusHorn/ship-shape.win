<script lang="ts">
	import './reset.css';
	import './core.css';
	import { page } from '$app/state';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';

	let { children } = $props();
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
		<a
			href="/generators/regular-polygon"
			aria-current={page.url.pathname === '/generators/regular-polygon'}
		>
			Regular polygon
		</a>
		<a href="/generators/star" aria-current={page.url.pathname === '/generators/star'}> Star </a>
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
	}

	.site-title {
		font-size: 2rem;

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
			font-size: 0.5em;
		}
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;

		a {
			padding-block: 0.2em;
			padding-inline: 0.25em;
			color: inherit;
			font-size: 1.2rem;
			font-weight: 600;
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
		}
	}

	footer {
		padding-block: 4rem 2rem;
		text-align: center;
	}
</style>
