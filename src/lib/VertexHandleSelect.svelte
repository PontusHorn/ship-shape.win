<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { type Vertex } from './Vertex';
	import { VertexDimension } from './VertexDimension';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { VertexPosition } from './VertexPosition';
	import { editor, selectVertex } from './editor.svelte';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		previewWidth: number;
		previewHeight: number;
	};

	const { vertex, onChangeVertex, previewWidth, previewHeight, ...props }: Props = $props();

	const isSelected = $derived(editor.selectedVertexId === vertex.id);

	function handleClick() {
		selectVertex(vertex.id);
	}

	function handlePointerDown() {
		// Select on pointer down to feel more responsive on drag
		selectVertex(vertex.id);
	}

	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: vertex.position.x.toPixels(previewWidth),
			y: vertex.position.y.toPixels(previewHeight)
		},
		legacyTranslate: false,
		onDrag: handleDrag,
		onDragEnd: handleDrag
	});

	function handleDrag({ offsetX, offsetY }: DragEventData) {
		const x = VertexDimension.fromPixels(vertex.position.x.type, previewWidth, offsetX);
		const y = VertexDimension.fromPixels(vertex.position.y.type, previewHeight, offsetY);

		onChangeVertex({ ...vertex, position: new VertexPosition(x, y) });
	}
</script>

<div class="vertex" class:isSelected use:draggable={dragOptions}>
	<button
		{...props}
		onpointerdown={handlePointerDown}
		onclick={handleClick}
		onkeydown={handleKeydown}
		aria-pressed={isSelected}
	>
		<span class="visually-hidden">Vertex at {vertex.position.x}, {vertex.position.y}</span>
	</button>
</div>

<style>
	.vertex {
		position: absolute;
		left: 0;
		top: 0;
		transition: opacity 0.2s ease;

		/* Dim when any other vertex is selected */
		:global(.hasSelection) &:not(.isSelected, :has(button:hover, :focus-visible)) {
			opacity: 0.5;
		}
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
