<script lang="ts">
	import './reset.css';
	import './core.css';
</script>

<header>
	<div class="site-title">
		<a href="/">
			<span class="icon" aria-hidden="true">⚓︎</span>
			ship-shape(<span class="win">.win</span>)
		</a>
	</div>
</header>

<slot />

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
</style>
