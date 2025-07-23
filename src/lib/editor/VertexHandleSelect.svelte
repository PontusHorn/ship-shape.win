<script lang="ts">
	import BaseVertexHandle from './VertexHandle.svelte';
	import VertexErrorPopover from './VertexErrorPopover.svelte';
	import { Vertex } from './Vertex';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { deleteVertex, selectVertex } from './editor.svelte';
	import { getArrowKeyDelta } from '../util/keyboardNavigation';
	import { translate, type Vector } from '../util/vector';
	import { UserError } from '../UserError';
	import type { DragEventData, DragOptions } from '@neodrag/svelte';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		maxSize: Vector;
	};

	const { vertex, onChangeVertex, maxSize, ...props }: Props = $props();

	let errorMessage = $state<string>();
	let isAltPressed = $state(false);

	const dragOptions = $derived<DragOptions>({
		onDrag: handleDrag,
		onDragEnd: handleDrag,
		disabled: isAltPressed
	});

	function handleDrag({ offsetX, offsetY }: DragEventData) {
		const newPosition = vertex.position.withVector([offsetX, offsetY], maxSize);
		const newVertex = vertex.withPosition(newPosition, maxSize);
		onChangeVertex(newVertex);
		selectVertex(newVertex.id);
	}

	function handleFocus() {
		if (!isAltPressed) {
			selectVertex(vertex.id);
		}
	}

	function handleClick(event: MouseEvent) {
		// Alt+click to delete
		if (event.altKey) {
			event.preventDefault();
			handleDeleteVertex();
			return;
		}

		selectVertex(vertex.id);
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
		const delta = getArrowKeyDelta(event);
		if (delta) {
			event.preventDefault();
			selectVertex(vertex.id);

			const currentVector = vertex.position.toVector(maxSize);
			const newVector = translate(currentVector, delta);
			const newPosition = vertex.position.withVector(newVector, maxSize);
			const newVertex = vertex.withPosition(newPosition, maxSize);
			onChangeVertex(newVertex);
			return;
		}

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
	onclick={handleClick}
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
