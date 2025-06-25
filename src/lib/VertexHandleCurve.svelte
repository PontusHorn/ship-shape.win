<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { type Vertex } from './Vertex';
	import { VertexDimension } from './VertexDimension';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { editor, selectVertex } from './editor.svelte';
	import ControlPointHandle from './ControlPointHandle.svelte';
	import { VertexPosition } from './VertexPosition';
	import type { Attachment } from 'svelte/attachments';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		defaultControlPointPosition: VertexPosition;
		previewWidth: number;
		previewHeight: number;
	};

	const {
		vertex,
		onChangeVertex,
		defaultControlPointPosition,
		previewWidth,
		previewHeight,
		...props
	}: Props = $props();

	const isSelected = $derived(editor.selectedVertexId === vertex.id);

	// Make the button draggable for creating control points
	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: vertex.position.x.toPixels(previewWidth),
			y: vertex.position.y.toPixels(previewHeight)
		},
		legacyTranslate: false,
		onDrag: handleDrag
	});

	function handlePointerDown() {
		// Select on pointer down to feel more responsive on drag
		selectVertex(vertex.id);
	}

	function handleVertexClick() {
		// The vertex is already selected on pointer down, but in case the "click"
		// is triggered via keyboard or other non-pointer means, we need to select
		// it here too.
		selectVertex(vertex.id);

		// Initialize control points if they don't exist
		if (vertex.controlPointForward || vertex.controlPointBackward) return;

		const controlPointForward = defaultControlPointPosition;
		const controlPointBackward = controlPointForward.toMirrored(
			vertex.position,
			previewWidth,
			previewHeight
		);

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
		const controlPointForward = new VertexPosition(
			VertexDimension.fromPixels(vertex.position.x.type, previewWidth, offsetX),
			VertexDimension.fromPixels(vertex.position.y.type, previewHeight, offsetY)
		);

		// Create a mirrored backward control point
		const controlPointBackward = controlPointForward.toMirrored(
			vertex.position,
			previewWidth,
			previewHeight
		);

		lastAddedControlPoint = controlPointForward;

		onChangeVertex({
			...vertex,
			isMirrored: true,
			controlPointForward,
			controlPointBackward
		});
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
			onpointerdown={handlePointerDown}
			onfocus={() => selectVertex(vertex.id)}
			onclick={handleVertexClick}
			aria-pressed={isSelected}
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
				isVertexSelected={isSelected}
				{previewWidth}
				{previewHeight}
				{@attach focusWhenAdded(vertex.controlPointForward)}
			/>
		{/if}
		{#if vertex.controlPointBackward}
			<ControlPointHandle
				{vertex}
				{onChangeVertex}
				controlPoint={vertex.controlPointBackward}
				isVertexSelected={isSelected}
				{previewWidth}
				{previewHeight}
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
