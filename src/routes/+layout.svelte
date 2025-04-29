<script lang="ts">
	import './reset.css';
	import './core.css';
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
</script>

<svelte:head>
	<title>{SITE_TITLE}</title>
	<meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

<header>
	<div class="site-title">
		<a href="/">
			<span class="icon" aria-hidden="true">⚓︎</span>
			ship-shape(<span class="win">.win</span>)
		</a>
	</div>
</header>

<slot />

<footer>
	Made by <a href="https://pontushorn.me">Pontus Horn</a>. Use the output however you like!
</footer>

<style>
	header {
		display: flex;
		align-items: center;
		background: var(--midnight);
		color: var(--linen);
		padding: 1rem;
	}

	.site-title {
		font-size: 2rem;

		a {
			color: inherit;
			text-underline-offset: 0.2em;
		}

		.win {
			font-size: 0.5em;
		}
	}

	footer {
		padding-block: 4rem 2rem;
		text-align: center;
	}
</style>
