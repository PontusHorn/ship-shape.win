<div class="polygons" role="img" aria-labelledby="polygons-description">
	<div class="hexagon"></div>
	<div class="pentagon"></div>
	<div class="flower"></div>
	<span id="polygons-description" class="visually-hidden">
		A rotating blue hexagon, an orange pentagon alternating between bulging and contracting sides,
		and a green flower shape that fades in and out.
	</span>
</div>

<style>
	.polygons {
		position: relative;
		aspect-ratio: 1;
		border-radius: 0.5rem;
		overflow: clip;
	}

	.hexagon {
		width: 55%;
		aspect-ratio: 1;
		position: absolute;
		top: 2%;
		right: 2%;
		background: var(--brand-400);
		clip-path: shape(
			from 99.4% 57.5%,
			line to 68.2% 96.6%,
			line to 18.8% 89.1%,
			line to 0.6% 42.5%,
			line to 31.8% 3.4%,
			line to 81.2% 10.9%,
			line to 99.4% 57.5%
		);

		@media (prefers-reduced-motion: no-preference) {
			animation: rotate 2s infinite
				linear(
					0,
					0.007 0.9%,
					0.03 1.9%,
					0.124 4.1%,
					0.66 12.4%,
					0.866 16.3%,
					0.944 18.3%,
					1.005 20.3%,
					1.048 22.3%,
					1.079 24.5%,
					1.096 27.3%,
					1.094 30.6%,
					1.016 44.3%,
					0.993 52.9%,
					1
				);
		}
	}

	@keyframes rotate {
		50%,
		100% {
			transform: rotate(60deg);
		}
	}

	.pentagon {
		width: 45%;
		aspect-ratio: 1;
		position: absolute;
		bottom: 2%;
		left: 2%;
		background: var(--tertiary-400);

		--sides: 5;
		--radius: 50%;
		--swell: 1.1;
		--swell-radius: calc(var(--radius) * cos(pi / var(--sides)) * var(--swell));
		--rotation: calc(0.25turn / var(--sides));
		--center-x: 50%;
		--center-y: 50%;
		clip-path: shape(
			from calc(var(--center-x) + var(--radius) * cos(var(--rotation) + 0turn / var(--sides)))
				calc(var(--center-y) + var(--radius) * sin(var(--rotation) + 0turn / var(--sides))),
			curve to calc(var(--center-x) + var(--radius) * cos(var(--rotation) + 1turn / var(--sides)))
				calc(var(--center-y) + var(--radius) * sin(var(--rotation) + 1turn / var(--sides))) with
				calc(var(--center-x) + var(--swell-radius) * cos(var(--rotation) + 0.5turn / var(--sides)))
				calc(var(--center-y) + var(--swell-radius) * sin(var(--rotation) + 0.5turn / var(--sides))),
			curve to calc(var(--center-x) + var(--radius) * cos(var(--rotation) + 2turn / var(--sides)))
				calc(var(--center-y) + var(--radius) * sin(var(--rotation) + 2turn / var(--sides))) with
				calc(var(--center-x) + var(--swell-radius) * cos(var(--rotation) + 1.5turn / var(--sides)))
				calc(var(--center-y) + var(--swell-radius) * sin(var(--rotation) + 1.5turn / var(--sides))),
			curve to calc(var(--center-x) + var(--radius) * cos(var(--rotation) + 3turn / var(--sides)))
				calc(var(--center-y) + var(--radius) * sin(var(--rotation) + 3turn / var(--sides))) with
				calc(var(--center-x) + var(--swell-radius) * cos(var(--rotation) + 2.5turn / var(--sides)))
				calc(var(--center-y) + var(--swell-radius) * sin(var(--rotation) + 2.5turn / var(--sides))),
			curve to calc(var(--center-x) + var(--radius) * cos(var(--rotation) + 4turn / var(--sides)))
				calc(var(--center-y) + var(--radius) * sin(var(--rotation) + 4turn / var(--sides))) with
				calc(var(--center-x) + var(--swell-radius) * cos(var(--rotation) + 3.5turn / var(--sides)))
				calc(var(--center-y) + var(--swell-radius) * sin(var(--rotation) + 3.5turn / var(--sides))),
			curve to calc(var(--center-x) + var(--radius) * cos(var(--rotation) + 5turn / var(--sides)))
				calc(var(--center-y) + var(--radius) * sin(var(--rotation) + 5turn / var(--sides))) with
				calc(var(--center-x) + var(--swell-radius) * cos(var(--rotation) + 4.5turn / var(--sides)))
				calc(var(--center-y) + var(--swell-radius) * sin(var(--rotation) + 4.5turn / var(--sides)))
		);

		@media (prefers-reduced-motion: no-preference) {
			animation: twang 1s infinite alternate
				linear(
					0,
					-0.008 11%,
					-0.025 14.6%,
					-0.054 17.9%,
					-0.152 24.1%,
					-0.408 35%,
					-0.439 37.5%,
					-0.436 39.6%,
					-0.405 41.3%,
					-0.35 42.8%,
					-0.156 45.6%,
					0.153 48.1%,
					1.05 53.4%,
					1.284 56%,
					1.413 59%,
					1.441 61.5%,
					1.418 64.4%,
					1.146 76.2%,
					1.047 82.7%,
					1.023 85.8%,
					1.008 89.3%,
					1
				);
		}
	}

	@property --swell {
		syntax: '<number>';
		initial-value: 1.1;
		inherits: false;
	}

	@keyframes twang {
		from {
			--swell: 0.8;
		}
		to {
			--swell: 1.1;
		}
	}

	.flower {
		width: 30%;
		aspect-ratio: 1;
		position: absolute;
		bottom: 2%;
		right: 10%;
		background: var(--secondary-400);

		clip-path: shape(
			from 93% 50%,
			curve to 90.1% 65.5% with 99% 59.2%,
			curve to 81.8% 79% with 92.4% 76.3%,
			curve to 69.2% 88.5% with 80.1% 89.8%,
			curve to 54% 92.8% with 63.6% 98%,
			curve to 38.2% 91.4% with 45.4% 99.7%,
			curve to 24.1% 84.3% with 27.8% 94.6%,
			curve to 13.4% 72.6% with 13.1% 83.6%,
			curve to 7.7% 57.9% with 3.5% 68%,
			curve to 7.7% 42.1% with 0.1% 50%,
			curve to 13.4% 27.4% with 3.5% 32%,
			curve to 24.1% 15.7% with 13.1% 16.4%,
			curve to 38.2% 8.6% with 27.8% 5.4%,
			curve to 54% 7.2% with 45.4% 0.3%,
			curve to 69.2% 11.5% with 63.6% 2%,
			curve to 81.8% 21% with 80.1% 10.2%,
			curve to 90.1% 34.5% with 92.4% 23.7%,
			curve to 93% 50% with 99% 40.8%
		);

		@media (prefers-reduced-motion: no-preference) {
			animation: bloom 3s infinite ease-out;
		}
	}

	@keyframes bloom {
		from {
			animation-timing-function: ease-in-out;
			opacity: 0;
			scale: 0.5;
		}
		20%,
		60% {
			animation-timing-function: ease-out;
			opacity: 1;
			scale: 1;
			rotate: 0deg;
		}
		to {
			opacity: 0;
			scale: 1.5;
			rotate: 60deg;
		}
	}
</style>
