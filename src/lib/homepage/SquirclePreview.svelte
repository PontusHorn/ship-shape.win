<div class="squircle" role="img" aria-labelledby="squircle-description">
	<span id="squircle-description" class="visually-hidden">
		Square shape with smoothly rounded corners, animating between different amounts of curvature.
	</span>
</div>

<style>
	.squircle {
		background: var(--brand-400);
		aspect-ratio: 1;

		--start: var(--curvature, 0%);
		--end: calc(100% - var(--curvature, 0%));
		clip-path: shape(
			from 50% 0%,
			curve to 100% 50% with var(--end) 0% / 100% var(--start),
			curve to 50% 100% with 100% var(--end) / var(--end) 100%,
			curve to 0% 50% with var(--start) 100% / 0% var(--end),
			curve to 50% 0% with 0% var(--start) / var(--start) 0%
		);

		@media (prefers-reduced-motion: no-preference) {
			animation: squircle 2s infinite alternate ease-in-out;
		}
	}

	@property --curvature {
		syntax: '<percentage>';
		initial-value: 0%;
		inherits: false;
	}

	@keyframes squircle {
		to {
			--curvature: 15%;
			background-color: var(--secondary-400);
		}
	}
</style>
