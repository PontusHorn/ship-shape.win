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

	<h2>About the <code>shape()</code> function</h2>
	<p>
		There are other ways to define shapes for <code>clip-path</code> and <code>offset-path</code>,
		such as using the <code>path()</code> or <code>polygon()</code> functions. These are older and
		have better browser support. So why use <code>shape()</code>?
	</p>
	<ul>
		<li>
			<code>path()</code> uses SVG syntax that is optimised for brevity and as such can be hard to
			read. <code>shape()</code> is arguably easier to read and modify by hand.
		</li>
		<li>
			<code>path()</code> only supports pixel values, making it hard to use in responsive settings.
			<code>shape()</code>
			supports percentages and all length values. Better yet, it allows using math functions like
			<code>calc()</code> too!
		</li>
		<li>
			The <code>polygon()</code> function also allows many units, but has no support for curves.
		</li>
	</ul>
	<p>
		That's not to say that the older functions are bad by any means. If they work for your use case,
		use them and enjoy the browser support! This site is not here to convince you to use <code
			>shape()</code
		>
		for everything, but rather about exploring what the <code>shape()</code>
		function can do for us, and to inspire learning, experimentation, and creativity.
	</p>
	<h3>Browser support</h3>
	<p>
		<code>shape()</code> is a newer function, but it is supported in Chrome, Edge, and Safari since
		early 2025. At the time of writing this, Firefox has implemented it in their nightly build, but
		not yet in a stable release. As such, this site is best viewed in an up-to-date Chromium-based
		browser or Safari for the moment. Normally I wouldn't be too happy about that, but since the
		site is specifically about <code>shape()</code> I think it's acceptable.
	</p>
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
