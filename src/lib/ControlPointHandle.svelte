<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { moveVertexControlPoint, type Vertex } from './Vertex';
	import { VertexPosition } from './VertexPosition';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { disableUntilHydrated } from './disableUntilHydrated';
	import { editor, selectVertex, type VertexPart } from './editor.svelte';
	import { getArrowKeyDelta } from './keyboardNavigation';
	import { translate, type Vector } from './vector';
	import { createControlPointButtonId } from './elementIds';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		controlPoint: VertexPosition;
		maxSize: Vector;
	};

	const { vertex, onChangeVertex, controlPoint, maxSize, ...props }: Props = $props();

	const direction = $derived(controlPoint === vertex.controlPointForward ? 'forward' : 'backward');
	const part = $derived<VertexPart>(
		direction === 'forward' ? 'controlPointForward' : 'controlPointBackward'
	);
	const isSelected = $derived(editor.selection?.id === vertex.id && editor.selection.part === part);

	function handleClick() {
		// The vertex is already selected on pointer down, but in case the "click"
		// is triggered via keyboard or other non-pointer means, we need to select
		// it here too.
		selectVertex(vertex.id, part);
	}

	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: controlPoint.x.toPixels(maxSize[0]),
			y: controlPoint.y.toPixels(maxSize[1])
		},
		legacyTranslate: false,
		onDrag: handleDrag
	});

	function handleKeydown(event: KeyboardEvent) {
		const delta = getArrowKeyDelta(event);
		if (!delta) return;

		event.preventDefault();
		selectVertex(vertex.id, part);

		const currentVector = controlPoint.toVector(maxSize);
		const newVector = translate(currentVector, delta);
		const newControlPoint = controlPoint.withVector(newVector, maxSize);

		// Break mirroring if Alt key is held
		let newVertex = event.altKey ? { ...vertex, isMirrored: false } : vertex;
		newVertex = moveVertexControlPoint(newVertex, direction, newControlPoint, maxSize);

		onChangeVertex(newVertex);
	}

	function handleDrag({ offsetX, offsetY, event }: DragEventData) {
		const newControlPoint = controlPoint.withVector([offsetX, offsetY], maxSize);

		// Break mirroring if Alt key is held
		let newVertex = event.altKey ? { ...vertex, isMirrored: false } : vertex;
		newVertex = moveVertexControlPoint(newVertex, direction, newControlPoint, maxSize);

		onChangeVertex(newVertex);

		selectVertex(vertex.id, part);
	}
</script>

<div class="control-point" use:draggable={dragOptions}>
	<button
		id={createControlPointButtonId(vertex.id, direction)}
		{...props}
		onclick={handleClick}
		onfocus={() => selectVertex(vertex.id, part)}
		onkeydown={handleKeydown}
		aria-pressed={isSelected}
		{...disableUntilHydrated()}
	>
		<span class="visually-hidden">
			{direction} control point for vertex at
			{vertex.position.x.toCss(maxSize[0], 'minimal')},
			{vertex.position.y.toCss(maxSize[1], 'minimal')}
		</span>
	</button>
</div>

<!-- Connecting line between vertex and control point -->
<svg class="control-line" aria-hidden="true">
	<line
		x1={vertex.position.x.toPixels(maxSize[0])}
		y1={vertex.position.y.toPixels(maxSize[1])}
		x2={controlPoint.x.toPixels(maxSize[0])}
		y2={controlPoint.y.toPixels(maxSize[1])}
	/>
</svg>

<style>
	.control-point {
		position: absolute;
		left: 0;
		top: 0;
		/* Show above the connection line to the vertex */
		z-index: 1;
	}

	button {
		all: unset;
		position: absolute;
		width: 8px;
		height: 8px;

		--_surface: var(--editorButton-color-surface);
		--_detail: var(--editorButton-color-detail);
		background-color: var(--_detail);
		border: 1px solid transparent;
		transition:
			background-color 0.1s ease-in-out,
			box-shadow 0.2s ease-in-out,
			scale 0.1s ease-in-out;
		translate: -50% -50%;

		&[aria-pressed='true'] {
			box-shadow:
				0 0 0 2px var(--_surface),
				0 0 0 4px var(--_detail);
		}

		&:hover {
			scale: 1.2;
		}

		&:focus-visible,
		&:active {
			box-shadow:
				0 0 0 2px var(--_surface),
				0 0 0 4px var(--_detail),
				0 0 0 6px var(--_surface);
			outline: none;
		}

		&:hover,
		&:focus-visible {
			--_surface: var(--editorButton-color-surface-interest);
			--_detail: var(--editorButton-color-detail-interest);
		}

		&:active {
			--_surface: var(--editorButton-color-surface-active);
			--_detail: var(--editorButton-color-detail-active);
		}

		&::before {
			position: absolute;
			inset: -8px;
			content: '';
			border-radius: 50%;

			@media (pointer: coarse) {
				inset: -17px;
			}
		}
	}

	.control-line {
		position: absolute;
		overflow: visible;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;

		line {
			stroke: var(--brand-400);
			stroke-width: 1;
			stroke-dasharray: 2, 2;
		}
	}
</style>
