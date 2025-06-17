<script lang="ts">
	import { draggable, type DragOptions } from '@neodrag/svelte';
	import { type Vertex } from './Vertex';
	import { VertexDimension } from './VertexDimension';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		previewWidth: number;
		previewHeight: number;
		draggingEnabled?: boolean;
	};

	const { vertex, previewWidth, previewHeight, draggingEnabled = true, ...props }: Props = $props();

	const dragOptions: DragOptions = $derived({
		disabled: !draggingEnabled,
		handle: 'button',
		position: {
			x: vertex.position.x.toPixels(previewWidth),
			y: vertex.position.y.toPixels(previewHeight)
		},
		legacyTranslate: false,
		onDrag({ offsetX, offsetY }) {
			vertex.position.x = VertexDimension.fromPixels(vertex.position.x.type, previewWidth, offsetX);
			vertex.position.y = VertexDimension.fromPixels(
				vertex.position.y.type,
				previewHeight,
				offsetY
			);
		},
		onDragEnd({ offsetX, offsetY }) {
			vertex.position.x = VertexDimension.fromPixels(vertex.position.x.type, previewWidth, offsetX);
			vertex.position.y = VertexDimension.fromPixels(
				vertex.position.y.type,
				previewHeight,
				offsetY
			);
		}
	});
</script>

<div class="vertex" use:draggable={dragOptions}>
	<button {...props}>
		<span class="visually-hidden">Vertex at {vertex.position.x}, {vertex.position.y}</span>
	</button>
</div>

<style>
	.vertex {
		position: absolute;
		left: 0;
		top: 0;
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
			outline: none;
		}

		&:hover,
		&:focus {
			filter: brightness(1.2) saturate(1.5);
		}
	}
</style>
