<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { Vertex } from './Vertex';
	import { VertexPosition } from './VertexPosition';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { disableUntilHydrated } from '../util/disableUntilHydrated';
	import { editor, selectVertex, deleteControlPoint, type VertexPart } from './Editor.svelte';
	import { getArrowKeyDelta } from '../util/keyboardNavigation';
	import { translate, type Vector } from '../util/vector';
	import { createControlPointButtonId } from '../util/elementIds';
	import { UserError } from '../UserError';
	import { X } from '@lucide/svelte';
	import VertexErrorPopover from './VertexErrorPopover.svelte';

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

	// Alt key state and error handling
	let isAltPressed = $state(false);
	let errorMessage = $state<string>();
	const buttonId = $derived(createControlPointButtonId(vertex.id, direction));

	function handleClick(event: MouseEvent) {
		// Alt+click to delete
		if (event.altKey) {
			event.preventDefault();
			handleDeleteControlPoint();
			return;
		}

		// Normal click behavior - select the control point
		selectVertex(vertex.id, part);
	}

	function handleFocus() {
		if (!isAltPressed) {
			selectVertex(vertex.id, part);
		}
	}

	function handleDeleteControlPoint() {
		try {
			deleteControlPoint(vertex.id, direction);
		} catch (error) {
			errorMessage =
				error instanceof UserError
					? error.userMessage
					: "Can't delete the control point due to an unexpected error.";
		}
	}

	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: controlPoint.x.toPixels(maxSize[0]),
			y: controlPoint.y.toPixels(maxSize[1])
		},
		legacyTranslate: false,
		onDrag: handleDrag,
		disabled: isAltPressed
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Delete') {
			event.preventDefault();
			handleDeleteControlPoint();
			return;
		}

		const delta = getArrowKeyDelta(event);
		if (!delta) return;

		event.preventDefault();
		selectVertex(vertex.id, part);

		const currentVector = controlPoint.toVector(maxSize);
		const newVector = translate(currentVector, delta);
		const newControlPoint = controlPoint.withVector(newVector, maxSize);

		// Break mirroring if Alt key is held
		let newVertex = event.altKey ? Vertex.make({ ...vertex, isMirrored: false }) : vertex;
		newVertex = newVertex.withControlPoint(direction, newControlPoint, maxSize);

		onChangeVertex(newVertex);
	}

	function handleDrag({ offsetX, offsetY, event }: DragEventData) {
		const newControlPoint = controlPoint.withVector([offsetX, offsetY], maxSize);

		// Break mirroring if Alt key is held
		let newVertex = event.altKey ? Vertex.make({ ...vertex, isMirrored: false }) : vertex;
		newVertex = newVertex.withControlPoint(direction, newControlPoint, maxSize);

		onChangeVertex(newVertex);

		selectVertex(vertex.id, part);
	}

	function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key === 'Alt') {
			isAltPressed = true;
		}
	}

	function handleWindowKeyUp(event: KeyboardEvent) {
		if (event.key === 'Alt') {
			isAltPressed = false;
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeyDown} onkeyup={handleWindowKeyUp} />

<div class="control-point" use:draggable={dragOptions}>
	<button
		type="button"
		id={buttonId}
		{...props}
		class:isAltPressed
		onclick={handleClick}
		onfocus={handleFocus}
		onkeydown={handleKeydown}
		aria-pressed={isSelected}
		style:anchor-name="--{buttonId}"
		{...disableUntilHydrated()}
	>
		<span class="visually-hidden">
			{direction} control point for vertex at
			{vertex.position.x.toCss(maxSize[0], 'minimal')},
			{vertex.position.y.toCss(maxSize[1], 'minimal')}
		</span>

		<span class="delete-hint">
			<X aria-hidden="true" size={8} />
		</span>
	</button>
</div>

<VertexErrorPopover
	isOpen={errorMessage !== undefined}
	onClose={() => {
		errorMessage = undefined;
	}}
>
	{errorMessage}
</VertexErrorPopover>

<!-- Connecting line between vertex and control point -->
<svg class="control-line" aria-hidden="true">
	<line
		x1={vertex.position.x.toPixels(maxSize[0])}
		y1={vertex.position.y.toPixels(maxSize[1])}
		x2={controlPoint.x.toPixels(maxSize[0])}
		y2={controlPoint.y.toPixels(maxSize[1])}
	/>
	<!-- Duplicate line with a different color, for better visibility -->
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
		color: var(--_surface);
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

		&.isAltPressed {
			--_surface: var(--error-300);
			--_detail: var(--error-950);
		}

		&.isAltPressed:is(:hover, :focus-visible) {
			--_delete-hint-opacity: 1;
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

		.delete-hint {
			position: absolute;
			left: 50%;
			top: 50%;
			translate: -50% -50%;
			opacity: var(--_delete-hint-opacity, 0);
			transition: opacity 0.2s ease;

			:global(svg) {
				max-width: none;
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
		/* Make the second line a lighter color and offset dashes to stand out
		against both dark and light backgrounds */
		line + line {
			stroke: var(--brand-050);
			stroke-dashoffset: 2;
		}
	}
</style>
