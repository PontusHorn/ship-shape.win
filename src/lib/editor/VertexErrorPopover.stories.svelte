<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, fn } from 'storybook/test';
	import VertexErrorPopover from './VertexErrorPopover.svelte';

	const { Story } = defineMeta({
		title: 'VertexErrorPopover',
		component: VertexErrorPopover,
		parameters: {
			layout: 'centered'
		},
		args: {
			isOpen: true,
			onClose: fn()
		},
		argTypes: {
			isOpen: {
				control: { type: 'boolean' }
			}
		}
	});
</script>

<Story
	name="Default"
	play={async ({ canvas }) => {
		const popover = canvas.getByRole('alert');
		expect(popover).toBeVisible();
	}}
>
	An error :(
</Story>

<Story name="Long Message">
	This is a very long error message that should wrap appropriately within the popover constraints
	and demonstrate how the component handles extended text content.
</Story>
