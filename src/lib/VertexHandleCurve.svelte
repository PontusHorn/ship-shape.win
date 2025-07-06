<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { type Vertex } from './Vertex';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { disableUntilHydrated } from './disableUntilHydrated';
	import { editor, selectVertex } from './editor.svelte';
	import ControlPointHandle from './ControlPointHandle.svelte';
	import { VertexPosition } from './VertexPosition';
	import type { Attachment } from 'svelte/attachments';
	import type { Vector } from './vector';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		defaultControlPointPosition: VertexPosition;
		maxSize: Vector;
	};

	const { vertex, onChangeVertex, defaultControlPointPosition, maxSize, ...props }: Props =
		$props();

	const isSelected = $derived(editor.selection?.id === vertex.id);
	const isPositionSelected = $derived(isSelected && editor.selection?.part === 'position');

	// Make the button draggable for creating control points
	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: vertex.position.x.toPixels(maxSize[0]),
			y: vertex.position.y.toPixels(maxSize[1])
		},
		legacyTranslate: false,
		onDrag: handleDrag
	});

	function handleVertexClick() {
		selectVertex(vertex.id, 'controlPointForward');

		// Initialize control points if they don't exist
		if (vertex.controlPointForward || vertex.controlPointBackward) return;

		const controlPointForward = defaultControlPointPosition.toRounded();
		const controlPointBackward = controlPointForward
			.toMirrored(vertex.position, maxSize)
			.toRounded();

		lastAddedControlPoint = controlPointForward;

		onChangeVertex({
			...vertex,
			isMirrored: true,
			controlPointForward,
			controlPointBackward
		});
	}

	function handleDrag({ offsetX, offsetY }: DragEventData) {
		// Create forward control point based on drag position
		const controlPointForward = vertex.position.withVector([offsetX, offsetY], maxSize).toRounded();

		// Create a mirrored backward control point
		const controlPointBackward = controlPointForward
			.toMirrored(vertex.position, maxSize)
			.toRounded();

		lastAddedControlPoint = controlPointForward;

		onChangeVertex({
			...vertex,
			isMirrored: true,
			controlPointForward,
			controlPointBackward
		});

		selectVertex(vertex.id, 'controlPointForward');
	}

	let lastAddedControlPoint = $state<VertexPosition>();
	function focusWhenAdded(controlPoint: VertexPosition): Attachment {
		return (element: Element) => {
			if (
				element instanceof HTMLElement &&
				controlPoint === lastAddedControlPoint &&
				document.activeElement !== element
			) {
				element.focus();
			}
		};
	}
</script>

<div class="wrapper" class:isSelected>
	<div class="vertex" use:draggable={dragOptions}>
		<!-- Draggable vertex button for clicking and creating control points -->
		<button
			{...props}
			onfocus={() => selectVertex(vertex.id)}
			onclick={handleVertexClick}
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
				{@attach focusWhenAdded(vertex.controlPointForward)}
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
