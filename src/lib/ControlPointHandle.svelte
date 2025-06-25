<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { type Vertex } from './Vertex';
	import { VertexDimension } from './VertexDimension';
	import { VertexPosition } from './VertexPosition';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { selectVertex } from './editor.svelte';
	import { getArrowKeyDelta } from './keyboardNavigation';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		controlPoint: VertexPosition;
		isVertexSelected?: boolean;
		previewWidth: number;
		previewHeight: number;
	};

	const {
		vertex,
		onChangeVertex,
		controlPoint,
		isVertexSelected = false,
		previewWidth,
		previewHeight,
		...props
	}: Props = $props();

	const direction = $derived(controlPoint === vertex.controlPointForward ? 'forward' : 'backward');

	function handlePointerDown() {
		// Select on pointer down to feel more responsive on drag
		selectVertex(vertex.id);
	}

	function handleClick() {
		// The vertex is already selected on pointer down, but in case the "click"
		// is triggered via keyboard or other non-pointer means, we need to select
		// it here too.
		selectVertex(vertex.id);
	}

	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: controlPoint.x.toPixels(previewWidth),
			y: controlPoint.y.toPixels(previewHeight)
		},
		legacyTranslate: false,
		onDrag: handleDrag
	});

	function handleKeydown(event: KeyboardEvent) {
		const delta = getArrowKeyDelta(event);
		if (!delta) return;

		event.preventDefault();
		selectVertex(vertex.id);

		const [deltaX, deltaY] = delta;
		const currentX = controlPoint.x.toPixels(previewWidth);
		const currentY = controlPoint.y.toPixels(previewHeight);
		const newX = currentX + deltaX;
		const newY = currentY + deltaY;

		moveControlPoint(newX, newY, { breakMirroring: event.altKey });
	}

	function handleDrag({ offsetX, offsetY, event }: DragEventData) {
		moveControlPoint(offsetX, offsetY, { breakMirroring: event.altKey });
	}

	function moveControlPoint(x: number, y: number, { breakMirroring = false } = {}) {
		const newControlPoint = new VertexPosition(
			VertexDimension.fromPixels(controlPoint.x.type, previewWidth, x),
			VertexDimension.fromPixels(controlPoint.y.type, previewHeight, y)
		);

		let { controlPointForward, controlPointBackward } = vertex;

		// Update the vertex's control point
		if (direction === 'forward') {
			controlPointForward = newControlPoint;
		} else {
			controlPointBackward = newControlPoint;
		}

		// Break mirroring if Alt key is held
		const isMirrored = vertex.isMirrored && !breakMirroring;

		if (isMirrored) {
			const mirroredPosition = newControlPoint.toMirrored(
				vertex.position,
				previewWidth,
				previewHeight
			);

			// Update the opposite control point
			if (direction === 'forward') {
				controlPointBackward = mirroredPosition;
			} else {
				controlPointForward = mirroredPosition;
			}
		}

		onChangeVertex({ ...vertex, controlPointForward, controlPointBackward, isMirrored });
	}

	const accessibleName = $derived(
		`${direction} control point for vertex at ${vertex.position.x}, ${vertex.position.y}`
	);
</script>

<div class="control-point" class:isVertexSelected use:draggable={dragOptions}>
	<button
		{...props}
		onpointerdown={handlePointerDown}
		onclick={handleClick}
		onfocus={() => selectVertex(vertex.id)}
		onkeydown={handleKeydown}
	>
		<span class="visually-hidden">{accessibleName}</span>
	</button>
</div>

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
		background-color: var(--fjord);
		border: 1px solid var(--fjord);
		transition:
			filter 0.1s ease-in-out,
			box-shadow 0.1s ease-in-out,
			scale 0.1s ease-in-out;
		translate: -50% -50%;

		&:hover {
			scale: 1.2;
			filter: brightness(1.2);
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
