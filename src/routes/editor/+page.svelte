<script lang="ts">
	import { SITE_DESCRIPTION, SITE_TITLE } from '$lib/constants';
	import AddVertexButton from '$lib/editor/AddVertexButton.svelte';
	import CssOutput from '$lib/CssOutput.svelte';
	import VertexHandleCurve from '$lib/editor/VertexHandleCurve.svelte';
	import VertexHandleSelect from '$lib/editor/VertexHandleSelect.svelte';
	import Toolbar from '$lib/Toolbar.svelte';
	import { clearVertexSelection, editor, selectVertex, updateVertex } from '$lib/editor/editor.svelte';
	import EditorLayout from '$lib/editor/EditorLayout.svelte';
	import { distance, type Vector } from '$lib/util/vector';
	import { tick } from 'svelte';
	import { getVertexButton } from '$lib/util/elementIds';
	import { getShapeCssProperties } from '$lib/util/output';
	import ShapePreview from '$lib/ShapePreview.svelte';
	import { outputConfig } from '$lib/outputConfig.svelte';
	import { closestPointOnCurve, interpolateCurve } from '$lib/util/curve';
	import { VertexPosition } from '$lib/editor/VertexPosition';
	import { assert, nonNullish } from '$lib/util/assert';
	import { clamp } from '$lib/util/math';
	import VertexForm from '$lib/editor/VertexForm.svelte';

	const previewSize: Vector = [300, 300];

	const shape = $derived(editor.drawing.toShape(previewSize));

	const cssProperties = $derived(
		getShapeCssProperties(shape, outputConfig.shapeProperty, outputConfig.codeStyle)
	);

	function handleBackgroundClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			clearVertexSelection();
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape' && editor.selection) {
			// If there are any open popovers on the page, cede priority to closing
			// them with the Escape key
			if (document.querySelector(':popover-open')) return;

			clearVertexSelection();
			event.preventDefault();
		}
	}

	const curves = $derived(Array.from(editor.drawing.curves(previewSize)));

	let addVertexPositionByCurveId = $state<Record<string, { t: number; point: VertexPosition }>>({});
	function handlePointerMove(event: PointerEvent) {
		const previewElement = event.currentTarget as HTMLElement;
		const { left, top } = previewElement.getBoundingClientRect();
		const pointerPos: Vector = [event.clientX - left, event.clientY - top];

		for (const { id, curve, from } of curves) {
			const closestResult = closestPointOnCurve(curve, pointerPos);

			// Check if pointer is close enough to the curve (within 30px)
			const distanceToCurve = distance(pointerPos, closestResult.point);
			const threshold = 15;

			if (distanceToCurve <= threshold) {
				// Update dynamic position to closest point on curve
				addVertexPositionByCurveId[id] = {
					point: from.position.withVector(closestResult.point, previewSize),
					t: closestResult.t
				};
				return;
			}
		}

		// Don't reset state to prevent button from "jumping back" when leaving
	}

	function handlePointerLeave() {
		addVertexPositionByCurveId = {};
	}

	function handleAddVertexKeydown(event: KeyboardEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		const curveId = nonNullish(button.dataset.curveId, 'Curve ID is required for AddVertexButton');
		const t = addVertexPositionByCurveId[curveId]?.t ?? 0.5;
		const index = curves.findIndex(({ id }) => id === curveId);
		assert(index !== -1, `Curve with ID ${curveId} not found`);
		const { curve, from, to } = editor.drawing.getCurveAt(previewSize, index);
		const direction =
			from.position.x.toPixels(previewSize[0]) > to.position.x.toPixels(previewSize[0]) ? -1 : 1;

		// Move along the curve with arrow keys
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			event.preventDefault();

			const newT =
				event.key === 'ArrowLeft'
					? clamp(t - 0.05 * direction, 0, 1)
					: clamp(t + 0.05 * direction, 0, 1);
			const newPosition = interpolateCurve(curve, newT);
			addVertexPositionByCurveId[curveId] = {
				point: from.position.withVector(newPosition, previewSize),
				t: newT
			};
			return;
		}

		// Handle number keys for precise control
		if (event.key.match(/\d/) !== null) {
			let newT = parseFloat(event.key) / 10; // Convert key to a value between 0 and 1
			if (newT === 0) {
				newT = 0.5; // Default to 0.5 (midpoint) if 0 is pressed
			}

			if (newT <= 0 || newT >= 1) return;

			event.preventDefault();
			const newPosition = interpolateCurve(curve, newT);
			addVertexPositionByCurveId[curveId] = {
				point: from.position.withVector(newPosition, previewSize),
				t: newT
			};
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
	<title>Visual shape() editor - {SITE_TITLE}</title>
	<meta name="description" content={`TODO ${SITE_DESCRIPTION}`} />
</svelte:head>

<EditorLayout>
	{#snippet preview()}
		<div
			class:hasSelection={!!editor.selection}
			onpointermove={handlePointerMove}
			onpointerleave={handlePointerLeave}
		>
			<button class="background" onclick={handleBackgroundClick}>
				<span class="visually-hidden">Clear selection</span>
			</button>

			<ShapePreview {cssProperties} {shape}>
				{#each editor.drawing.vertices as vertex, index (vertex.id)}
					{#if editor.tool === 'select'}
						<VertexHandleSelect
							{vertex}
							onChangeVertex={updateVertex}
							maxSize={previewSize}
						/>
					{:else if editor.tool === 'curve'}
						<VertexHandleCurve
							{vertex}
							onChangeVertex={updateVertex}
							defaultControlPointPosition={editor.drawing.getTangentialPositionAt(
								previewSize,
								30,
								index
							)}
							maxSize={previewSize}
						/>
					{/if}
				{/each}

				{#each curves as { id }, index (id)}
					{@const hoveredPosition = addVertexPositionByCurveId[id]?.point}
					{@const position = hoveredPosition ?? editor.drawing.getMidpointAt(previewSize, index)}

					<AddVertexButton
						{position}
						maxSize={previewSize}
						onAddVertex={() => {
							const newVertexId = editor.drawing.insertVertex(index, position.toRounded());

							// Select the first control point, and focus it after mount
							selectVertex(newVertexId);
							tick().then(() => {
								getVertexButton(newVertexId)?.focus();
							});
						}}
						onkeydown={handleAddVertexKeydown}
						data-curve-id={id}
					/>
				{/each}
			</ShapePreview>
		</div>
	{/snippet}

	<Toolbar />

	<VertexForm />

	{#snippet output()}
		<CssOutput {cssProperties} />
	{/snippet}
</EditorLayout>

<style>
	.background {
		all: unset;
		position: absolute;
		inset: 0;
	}
</style>
