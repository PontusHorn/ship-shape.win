<script lang="ts">
	import RegularPolygonPreview from '$lib/homepage/RegularPolygonPreview.svelte';
	import SquirclePreview from '$lib/homepage/SquirclePreview.svelte';
	import StarPreview from '$lib/homepage/StarPreview.svelte';
</script>

<div class="page">
	<h1>Ship-shape CSS generators</h1>
	<p>
		Ahoy! Welcome to ship-shape.win, your go-to skiff for creating and customizing CSS shapes. This
		site has a collection of CSS generators for creating common (and some uncommon) shapes. The
		generated CSS uses the
		<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape/shape">
			<code>shape()</code>
		</a>
		function, which can be used as a value for the
		<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path">
			<code>clip-path</code>
		</a>
		and
		<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path">
			<code>offset-path</code>
		</a>
		properties.
	</p>
	<p>
		You can generate various parametric shapes, and the <a href="/editor">editor</a>
		allows you to create and modify shapes interactively. The parametric shapes can also be imported
		into the editor for further customization.
	</p>

	<h2>Generators</h2>
	<div class="generators">
		<article>
			<h3><a href="/generators/regular-polygon">Regular polygon</a></h3>
			<div class="image">
				<RegularPolygonPreview />
			</div>
			<p>
				Regular polygon with a chosen number of sides and radius. The "swell" parameter makes it
				less regular.
			</p>
		</article>

		<article>
			<h3><a href="/generators/star">Star</a></h3>
			<div class="image">
				<StarPreview />
			</div>
			<p>
				Why be regular when you can be a star? Choose a number of points, an inner and an outer
				radius.
			</p>
		</article>

		<article>
			<h3><a href="/generators/squircle">Squircle</a></h3>
			<div class="image">
				<SquirclePreview />
			</div>
			<p>Everybody's favourite shape, a square with smoothly rounded corners.</p>
		</article>
	</div>
</div>

<style>
	.page {
		padding: 2rem;
		max-width: 80ch;
		margin: 0 auto;
	}

	p {
		margin-block: 1rem;
	}

	.generators {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
		margin-block: 1rem;
	}

	article {
		position: relative;
		display: grid;
		grid-template-areas: 'image heading' 'image text';
		grid-template-rows: auto 1fr;
		grid-template-columns: 150px 1fr;
		gap: 0.25rem 1rem;
		background: var(--brand-050);
		border-radius: 0.5rem;
		box-shadow: 0.5px 1px 4px var(--brand-200);
		padding: 1rem;

		h3 {
			grid-area: heading;
			margin: 0;
		}

		.image {
			grid-area: image;
		}

		p {
			grid-area: text;
			margin: 0;
		}
	}
</style>
