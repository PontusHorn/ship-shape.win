<script lang="ts">
	import { draggable, type DragEventData, type DragOptions } from '@neodrag/svelte';
	import { type Vertex } from './Vertex';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { disableUntilHydrated } from './disableUntilHydrated';
	import { deleteVertex, editor, selectVertex } from './editor.svelte';
	import ControlPointHandle from './ControlPointHandle.svelte';
	import { VertexPosition } from './VertexPosition';
	import type { Vector } from './vector';
	import { tick } from 'svelte';
	import { createVertexButtonId, getControlPointButton } from './elementIds';
	import { UserError } from './UserError';
	import { X } from '@lucide/svelte';

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

	let errorMessage = $state('');
	let isAltPressed = $state(false);

	// Make the button draggable for creating control points
	const dragOptions: DragOptions = $derived({
		handle: 'button',
		position: {
			x: vertex.position.x.toPixels(maxSize[0]),
			y: vertex.position.y.toPixels(maxSize[1])
		},
		legacyTranslate: false,
		onDrag: handleDrag,
		disabled: isAltPressed
	});

	function handleFocus() {
		if (!isAltPressed) {
			selectVertex(vertex.id);
		}
	}

	function handleVertexClick(event: MouseEvent) {
		// Alt+click to delete
		if (event.altKey) {
			event.preventDefault();
			handleDeleteVertex();
			return;
		}

		selectVertex(vertex.id, 'controlPointForward');

		// Initialize control points if they don't exist
		if (vertex.controlPointForward || vertex.controlPointBackward) return;

		const controlPointForward = defaultControlPointPosition.toRounded();
		const controlPointBackward = controlPointForward
			.toMirrored(vertex.position, maxSize)
			.toRounded();

		onChangeVertex({
			...vertex,
			isMirrored: true,
			controlPointForward,
			controlPointBackward
		});

		// Select the first control point, and focus it after it mounts
		selectVertex(vertex.id, 'controlPointForward');
		tick().then(() => {
			getControlPointButton(vertex.id, 'forward')?.focus();
		});
	}

	function handleDeleteVertex() {
		try {
			deleteVertex(vertex.id);
		} catch (error) {
			errorMessage =
				error instanceof UserError
					? error.message
					: "Couldn't delete the vertex due to an unexpected error.";
			const errorPopover = document.getElementById(`vertex-error-${vertex.id}`);
			errorPopover?.showPopover();
		}
	}

	function handleDrag({ offsetX, offsetY }: DragEventData) {
		// Create forward control point based on drag position
		const controlPointForward = vertex.position.withVector([offsetX, offsetY], maxSize).toRounded();

		// Create a mirrored backward control point
		const controlPointBackward = controlPointForward
			.toMirrored(vertex.position, maxSize)
			.toRounded();

		onChangeVertex({
			...vertex,
			isMirrored: true,
			controlPointForward,
			controlPointBackward
		});

		// Select the first control point, and focus it after it mounts
		selectVertex(vertex.id, 'controlPointForward');
		tick().then(() => {
			getControlPointButton(vertex.id, 'forward')?.focus();
		});
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Delete') {
			event.preventDefault();
			handleDeleteVertex();
		}
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

<div class="wrapper" class:isSelected>
	<div class="vertex" use:draggable={dragOptions}>
		<!-- Draggable vertex button for clicking and creating control points -->
		<button
			id={createVertexButtonId(vertex.id)}
			class:isAltPressed
			{...props}
			onfocus={handleFocus}
			onclick={handleVertexClick}
			onkeydown={handleKeydown}
			aria-pressed={isPositionSelected}
			{...disableUntilHydrated()}
		>
			<span class="visually-hidden">
				Vertex at
				{vertex.position.x.toCss(maxSize[0], 'minimal')},
				{vertex.position.y.toCss(maxSize[1], 'minimal')}
			</span>

			<span class="delete-hint">
				<X aria-hidden="true" size={12} />
			</span>
		</button>

		<div
			role="alert"
			class="error"
			id="vertex-error-{vertex.id}"
			popover="auto"
			ontoggle={(event) => {
				if (event.newState === 'closed') {
					errorMessage = '';
				}
			}}
		>
			{errorMessage}
		</div>
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
		anchor-name: --errorAnchor;
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

		--_surface: var(--editorButton-color-surface);
		--_detail: var(--editorButton-color-detail);
		background-color: var(--_surface);
		border: 2px solid var(--_detail);
		border-radius: 50%;
		color: var(--_detail);
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

		&::before {
			position: absolute;
			inset: -8px;
			content: '';
			border-radius: 50%;

			@media (pointer: coarse) {
				inset: -15px;
			}
		}

		.delete-hint {
			position: absolute;
			left: 50%;
			top: 50%;
			translate: -50% -50%;
			opacity: 0;
			transition: opacity 0.2s ease;
			border-radius: 50%;

			.isAltPressed:is(:hover, :focus-visible) & {
				opacity: 1;
			}

			:global(svg) {
				max-width: none;
			}
		}
	}

	.error:popover-open {
		position: absolute;
		position-anchor: --errorAnchor;
		position-area: block-start;
		position-try: block-start, flip-block, inline-end, flip-inline;
		margin: 2rem;
		max-inline-size: 30ch;
		padding-block: 0.3rem;
		padding-inline: 0.5rem;
		/* Need to inherit the vertex translation for correct positioning */
		translate: inherit;

		background-color: var(--error-300);
		border: 2px solid var(--error-950);
		border-radius: 0.5rem;
		color: var(--error-950);
	}
</style>
