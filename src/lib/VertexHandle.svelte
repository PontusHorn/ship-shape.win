<script lang="ts">
	import type { XDimension, YDimension } from './Position';
	import type { Vertex } from './Vertex';

	const { vertex }: { vertex: Vertex } = $props();

	const { left, right } = $derived(getXStyle(vertex.position.x));
	const { top, bottom } = $derived(getYStyle(vertex.position.y));

	function getXStyle(x: XDimension): { left?: string; right?: string } {
		if (x === 'left') return { left: '0' };
		if (x === 'right') return { right: '0' };
		if (x === 'center') return { left: '50%' };
		return { left: x.toString() };
	}

	function getYStyle(y: YDimension): { top?: string; bottom?: string } {
		if (y === 'top') return { top: '0' };
		if (y === 'bottom') return { bottom: '0' };
		if (y === 'center') return { top: '50%' };
		return { top: y.toString() };
	}
</script>

<div class="vertex" style:left style:right style:top style:bottom>
	<button>
		<span class="visually-hidden">Vertex at {vertex.position.x}, {vertex.position.y}</span>
	</button>
</div>

<style>
	.vertex {
		position: absolute;
	}

	button {
		all: unset;
		position: absolute;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background-color: var(--verdigris);
		border: 2px solid var(--fjord);
		transition:
			filter 0.1s ease-in-out,
			outline-color 0.1s ease-in-out,
			box-shadow 0.1s ease-in-out,
			scale 0.1s ease-in-out;
		translate: -50% -50%;

		&:hover {
			scale: 1.2;
		}

		&:focus {
			box-shadow:
				0 0 0 2px var(--pistachio),
				0 0 0 4px var(--fjord),
				0 0 0 6px var(--pistachio);
			outline-color: var(--abyss);
			outline: none;
		}

		&:hover,
		&:focus {
			filter: brightness(1.2) saturate(1.5);
		}
	}
</style>
