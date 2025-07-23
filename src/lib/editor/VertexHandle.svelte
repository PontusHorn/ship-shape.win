<script lang="ts">
	import { draggable, type DragOptions } from '@neodrag/svelte';
	import { type Vertex } from './Vertex';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { disableUntilHydrated } from '../util/disableUntilHydrated';
	import { editor } from './editor.svelte';
	import ControlPointHandle from './ControlPointHandle.svelte';
	import { createVertexButtonId } from '../util/elementIds';
	import { X } from '@lucide/svelte';
	import type { Vector } from '../util/vector';
	import type { Snippet } from 'svelte';

	type Props = HTMLButtonAttributes & {
		vertex: Vertex;
		onChangeVertex: (vertex: Vertex) => void;
		maxSize: Vector;
		dragOptions: DragOptions;
		isAltPressed: boolean;
		children?: Snippet;
	};

	const {
		vertex,
		onChangeVertex,
		maxSize,
		dragOptions,
		isAltPressed,
		children,
		...buttonProps
	}: Props = $props();

	const isSelected = $derived(editor.selection?.id === vertex.id);
	const isPositionSelected = $derived(isSelected && editor.selection?.part === 'position');

	const [x, y] = $derived(vertex.position.toVector(maxSize));

	const fullDragOptions = $derived<DragOptions>({
		handle: 'button',
		position: { x, y },
		legacyTranslate: false,
		...dragOptions
	});
</script>

<div class="wrapper" class:isSelected>
	<div class="vertex" style:translate={`${x}px  ${y}px`} use:draggable={fullDragOptions}>
		<button
			id={createVertexButtonId(vertex.id)}
			class:isAltPressed
			aria-pressed={isPositionSelected}
			{...buttonProps}
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

		{#if children}
			{@render children()}
		{/if}
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
	}

	.vertex {
		position: absolute;
		anchor-name: --vertex;
		left: 0;
		top: 0;
		/* Show above the connection lines to the control points, and above
		AddVertexButton */
		z-index: 2;

		/* Dim when any other vertex is selected */
		:global(.hasSelection) &:not(.isSelected &, :hover, :focus-visible) {
			opacity: 0.5;
		}
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

		&.isAltPressed:is(:hover, :focus-visible) {
			--_delete-hint-opacity: 1;
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
			opacity: var(--_delete-hint-opacity, 0);
			transition: opacity 0.2s ease;
			border-radius: 50%;

			:global(svg) {
				max-width: none;
			}
		}
	}
</style>
