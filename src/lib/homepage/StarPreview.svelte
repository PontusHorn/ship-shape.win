<div class="stars" role="img" aria-labelledby="stars-description">
	<div class="big-star"></div>
	<div class="pulsating-star"></div>
	<div class="pointy-star"></div>
	<span id="stars-description" class="visually-hidden">
		A pulsating green five-pointed star, a pink/orange star whose many points alternate between
		poking in or out, and a partially obscured blue star with broad and short points.
	</span>
</div>

<style>
	.stars {
		position: relative;
		aspect-ratio: 1;
		border-radius: 0.5rem;
		overflow: clip;
	}

	.big-star {
		width: 100%;
		aspect-ratio: 1;
		position: absolute;
		bottom: -45%;
		left: -25%;
		background: var(--brand-400);
		clip-path: shape(
			from 100% 50%,
			line to 88% 62.4%,
			line to 90.5% 79.4%,
			line to 73.5% 82.4%,
			line to 65.5% 97.6%,
			line to 50% 90%,
			line to 34.5% 97.6%,
			line to 26.5% 82.4%,
			line to 9.5% 79.4%,
			line to 12% 62.4%,
			line to 0% 50%,
			line to 12% 37.6%,
			line to 9.5% 20.6%,
			line to 26.5% 17.6%,
			line to 34.5% 2.4%,
			line to 50% 10%,
			line to 65.5% 2.4%,
			line to 73.5% 17.6%,
			line to 90.5% 20.6%,
			line to 88% 37.6%,
			close
		);

		@media (prefers-reduced-motion: no-preference) {
			animation: rotate 20s infinite linear;
		}
	}

	@keyframes rotate {
		to {
			transform: rotate(360deg);
		}
	}

	.pulsating-star {
		width: 50%;
		aspect-ratio: 1;
		position: absolute;
		top: 5%;
		right: 5%;
		background: var(--secondary-400);

		--points: 5;
		--outer-radius: 50%;
		--inner-radius: 20%;
		--center-x: 50%;
		--center-y: 50%;
		clip-path: shape(
			from calc(var(--center-x) + var(--outer-radius) * cos(calc(0turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(0turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(0.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(0.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(1turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(1turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(1.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(1.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(2turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(2turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(2.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(2.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(3turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(3turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(3.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(3.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(4turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(4turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(4.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(4.5turn / var(--points)))),
			close
		);

		@media (prefers-reduced-motion: no-preference) {
			animation: pulse 1s infinite alternate ease-in-out;
		}
	}

	@property --outer-radius {
		syntax: '<percentage>';
		initial-value: 50%;
		inherits: false;
	}

	@property --inner-radius {
		syntax: '<percentage>';
		initial-value: 20%;
		inherits: false;
	}

	@keyframes pulse {
		from {
			--outer-radius: 46%;
			--inner-radius: 20%;
		}
		to {
			--outer-radius: 50%;
			--inner-radius: 27%;
			background-color: var(--secondary-300);
		}
	}

	.pointy-star {
		width: 30%;
		aspect-ratio: 1;
		position: absolute;
		top: 10%;
		left: 10%;
		background: var(--tertiary-400);

		--points: 12;
		--outer-radius: 50%;
		--inner-radius: 35%;
		--center-x: 50%;
		--center-y: 50%;
		clip-path: shape(
			from calc(var(--center-x) + var(--outer-radius) * cos(calc(0turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(0turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(0.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(0.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(1turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(1turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(1.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(1.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(2turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(2turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(2.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(2.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(3turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(3turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(3.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(3.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(4turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(4turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(4.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(4.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(5turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(5turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(5.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(5.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(6turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(6turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(6.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(6.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(7turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(7turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(7.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(7.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(8turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(8turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(8.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(8.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(9turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(9turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(9.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(9.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(10turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(10turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(10.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(10.5turn / var(--points)))),
			line to calc(var(--center-x) + var(--outer-radius) * cos(calc(11turn / var(--points))))
				calc(var(--center-y) + var(--outer-radius) * sin(calc(11turn / var(--points)))),
			line to calc(var(--center-x) + var(--inner-radius) * cos(calc(11.5turn / var(--points))))
				calc(var(--center-y) + var(--inner-radius) * sin(calc(11.5turn / var(--points)))),
			close
		);

		@media (prefers-reduced-motion: no-preference) {
			animation: switch-points 2s infinite alternate ease-in-out;
		}
	}

	@keyframes switch-points {
		to {
			--outer-radius: 15%;
			background-color: var(--error-400);
		}
	}
</style>
