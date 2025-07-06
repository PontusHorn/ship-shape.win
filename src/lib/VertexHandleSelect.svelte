<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { moveVertex, type Vertex } from './Vertex';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { editor, selectVertex } from './editor.svelte';
	import { getArrowKeyDelta } from './keyboardNavigation';
	import ControlPointHandle from './ControlPointHandle.svelte';
	import { disableUntilHydrated } from './disableUntilHydrated';
	import { translate, type Vector } from './vector';
	import { createVertexButtonId } from './elementIds';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		maxSize: Vector;
	};

	const { vertex, onChangeVertex, maxSize, ...props }: Props = $props();

	const isSelected = $derived(editor.selection?.id === vertex.id);
	const isPositionSelected = $derived(isSelected && editor.selection?.part === 'position');

	function handleClick() {
		selectVertex(vertex.id);
	}

	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: vertex.position.x.toPixels(maxSize[0]),
			y: vertex.position.y.toPixels(maxSize[1])
		},
		legacyTranslate: false,
		onDrag: handleDrag,
		onDragEnd: handleDrag
	});

	function handleDrag({ offsetX, offsetY }: DragEventData) {
		const newPosition = vertex.position.withVector([offsetX, offsetY], maxSize);
		const newVertex = moveVertex(vertex, newPosition, maxSize);
		onChangeVertex(newVertex);
		selectVertex(newVertex.id);
	}

	function handleKeydown(event: KeyboardEvent) {
		const delta = getArrowKeyDelta(event);
		if (!delta) return;

		event.preventDefault();
		selectVertex(vertex.id);

		const currentVector = vertex.position.toVector(maxSize);
		const newVector = translate(currentVector, delta);
		const newPosition = vertex.position.withVector(newVector, maxSize);
		const newVertex = moveVertex(vertex, newPosition, maxSize);
		onChangeVertex(newVertex);
	}
</script>

<div class="wrapper" class:isSelected>
	<div class="vertex" use:draggable={dragOptions}>
		<button
			id={createVertexButtonId(vertex.id)}
			{...props}
			onfocus={() => selectVertex(vertex.id)}
			onclick={handleClick}
			onkeydown={handleKeydown}
			aria-pressed={isPositionSelected}
			{...disableUntilHydrated()}
		>
			<span class="visually-hidden">Vertex at {vertex.position.x}, {vertex.position.y}</span>
		</button>
	</div>

	<div class="control-points">
		{#if vertex.controlPointForward}
			<ControlPointHandle
				{vertex}
				{onChangeVertex}
				controlPoint={vertex.controlPointForward}
				{maxSize}
			/>
		{/if}
		{#if vertex.controlPointBackward}
			<ControlPointHandle
				{vertex}
				{onChangeVertex}
				controlPoint={vertex.controlPointBackward}
				{maxSize}
			/>
		{/if}
	</div>
</div>

<style>
	.wrapper {
		transition: opacity 0.2s ease;

		/* Dim when any other vertex is selected */
		:global(.hasSelection) &:not(.isSelected, :has(button:hover, :focus-visible)) {
			opacity: 0.5;
		}
	}

	.vertex {
		position: absolute;
		left: 0;
		top: 0;
		/* Show above the connection lines to the control points */
		z-index: 1;
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

		&[aria-pressed='true'] {
			box-shadow:
				0 0 0 2px var(--pistachio),
				0 0 0 4px var(--fjord);
		}

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
