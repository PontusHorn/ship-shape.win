<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fireEvent, fn, within } from 'storybook/test';
	import VertexHandleSelect from './VertexHandleSelect.svelte';
	import { VertexDimension } from './VertexDimension';
	import { VertexPosition } from './VertexPosition';
	import { Vertex } from './Vertex';

	const { Story } = defineMeta({
		title: 'VertexHandleSelect',
		component: VertexHandleSelect,
		parameters: {
			layout: 'centered'
		},
		args: {
			onCommitChange: fn()
		}
	});

	function getElementCenter(element: HTMLElement) {
		const { left, top, width, height } = element.getBoundingClientRect();
		return { x: left + width / 2, y: top + height / 2 };
	}

	let vertices = $state({
		centered: Vertex.make({
			position: new VertexPosition(
				new VertexDimension('percent', 50),
				new VertexDimension('percent', 50)
			)
		}),
		differentDimensionTypes: Vertex.make({
			position: new VertexPosition(
				new VertexDimension('px_from_start', 50),
				new VertexDimension('px_from_end', 30)
			)
		})
	});
</script>

<Story
	name="Centered"
	args={{
		vertex: vertices.centered,
		onChangeVertex: (vertex) => {
			vertices.centered = vertex;
		},
		maxSize: [200, 200]
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Test that there's an accessible button with a helpful name
		const button = canvas.getByRole('button');
		await expect(button).toBeInTheDocument();
		await expect(button).toHaveAccessibleName('Vertex at 50%, 50%');

		// Drag the button 50px down and to the right
		const start = getElementCenter(button);
		const end = { x: start.x + 50, y: start.y + 50 };
		fireEvent.pointerDown(button, { clientX: start.x, clientY: start.y });
		fireEvent.pointerMove(button, { clientX: end.x, clientY: end.y });

		// Verify that the button follows along
		const position = getElementCenter(button);
		expect(position).toEqual({ x: start.x + 50, y: start.y + 50 });

		// Verify that the input vertex is updated (moved 50px/200px = 25% in each direction)
		expect(vertices.centered.position.x).toMatchObject({ dimensionType: 'percent', value: 75 });
		expect(vertices.centered.position.y).toMatchObject({ dimensionType: 'percent', value: 75 });

		// Move pointer back and release to "reset" the story state
		fireEvent.pointerMove(button, { clientX: start.x, clientY: start.y });
		fireEvent.pointerUp(button, {});
	}}
/>

<Story
	name="Different dimension types"
	args={{
		vertex: vertices.differentDimensionTypes,
		onChangeVertex: (vertex) => {
			vertices.differentDimensionTypes = vertex;
		},
		maxSize: [200, 200]
	}}
	play={async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');

		// The accessible name should use absolute values for brevity
		await expect(button).toHaveAccessibleName('Vertex at 50px, 170px');

		// Drag the button 50px down and to the right
		const start = getElementCenter(button);
		const end = { x: start.x + 50, y: start.y + 50 };
		fireEvent.pointerDown(button, { clientX: start.x, clientY: start.y });
		fireEvent.pointerMove(button, { clientX: end.x, clientY: end.y });

		// Verify that the button follows along
		const position = getElementCenter(button);
		expect(position).toEqual({ x: start.x + 50, y: start.y + 50 });

		// Verify that the input vertex is updated and that the dimension type is preserved
		expect(vertices.differentDimensionTypes.position.x).toMatchObject({
			dimensionType: 'px_from_start',
			value: 100
		});
		expect(vertices.differentDimensionTypes.position.y).toMatchObject({
			dimensionType: 'px_from_end',
			value: -20
		});

		// Move pointer back and release to "reset" the story state
		fireEvent.pointerMove(button, { clientX: start.x, clientY: start.y });
		fireEvent.pointerUp(button, {});
	}}
/>
