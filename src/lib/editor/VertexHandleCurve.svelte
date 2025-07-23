<script lang="ts">
	import BaseVertexHandle from './VertexHandle.svelte';
	import VertexErrorPopover from './VertexErrorPopover.svelte';
	import { Vertex } from './Vertex';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { deleteVertex, selectVertex } from './editor.svelte';
	import { VertexPosition } from './VertexPosition';
	import type { Vector } from '../util/vector';
	import { tick } from 'svelte';
	import { getControlPointButton } from '../util/elementIds';
	import { UserError } from '../UserError';
	import type { DragEventData, DragOptions } from '@neodrag/svelte';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		defaultControlPointPosition: VertexPosition;
		maxSize: Vector;
	};

	const { vertex, onChangeVertex, defaultControlPointPosition, maxSize, ...props }: Props =
		$props();

	let errorMessage = $state<string>();
	let isAltPressed = $state(false);

	// Make the button draggable for creating control points
	const dragOptions = $derived<DragOptions>({
		onDrag: handleDrag,
		disabled: isAltPressed
	});

	function handleDrag({ offsetX, offsetY }: DragEventData) {
		// Create forward control point based on drag position
		const controlPointForward = vertex.position.withVector([offsetX, offsetY], maxSize).toRounded();

		// Create a mirrored backward control point
		const controlPointBackward = controlPointForward
			.toMirrored(vertex.position, maxSize)
			.toRounded();

		onChangeVertex(
			Vertex.make({
				...vertex,
				isMirrored: true,
				controlPointForward,
				controlPointBackward
			})
		);

		// Select the first control point, and focus it after it mounts
		selectVertex(vertex.id, 'controlPointForward');
		tick().then(() => {
			getControlPointButton(vertex.id, 'forward')?.focus();
		});
	}

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

		// If the vertex already has control points, just select it
		if (vertex.controlPointForward && vertex.controlPointBackward) {
			selectVertex(vertex.id);
			return;
		}

		// Initialize control points if either doesn't exist
		const controlPointForward = defaultControlPointPosition.toRounded();
		const controlPointBackward = controlPointForward
			.toMirrored(vertex.position, maxSize)
			.toRounded();

		onChangeVertex(
			Vertex.make({
				...vertex,
				isMirrored: true,
				controlPointForward,
				controlPointBackward
			})
		);

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
		}
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

<BaseVertexHandle
	{vertex}
	{onChangeVertex}
	{maxSize}
	{dragOptions}
	{isAltPressed}
	onfocus={handleFocus}
	onclick={handleVertexClick}
	onkeydown={handleKeydown}
	{...props}
>
	<VertexErrorPopover
		isOpen={errorMessage !== undefined}
		onClose={() => {
			errorMessage = '';
		}}
	>
		{errorMessage}
	</VertexErrorPopover>
</BaseVertexHandle>
