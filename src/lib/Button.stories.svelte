<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { MousePointer } from '@lucide/svelte';
	import Button from './Button.svelte';

	const { Story } = defineMeta({
		title: 'Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			'aria-checked': {
				control: { type: 'boolean' }
			},
			disabled: {
				control: { type: 'boolean' }
			}
		}
	});
</script>

<Story name="Default">Default button</Story>

<Story name="With icon">
	{#snippet template(args)}
		<Button {...args}>
			{#snippet icon()}
				<MousePointer size={20} />
			{/snippet}
			Select
		</Button>
	{/snippet}
</Story>

<Story name="Pressed" args={{ 'aria-pressed': 'true' }}>I'm active</Story>

<Story name="Disabled" args={{ disabled: true }}>I'm disabled</Story>

<Story name="Pressed + Disabled" args={{ 'aria-pressed': 'true', disabled: true }}>
	I'm disabled and active
</Story>
