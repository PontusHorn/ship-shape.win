<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import Toolbar from './Toolbar.svelte';

	const { Story } = defineMeta({
		title: 'Toolbar',
		component: Toolbar,
		tags: ['autodocs']
	});
</script>

<Story name="Default" />

<Story
	name="Interaction test"
	tags={['!autodocs']}
	play={async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		// Get the Select and Curve tool buttons
		const selectButton = canvas.getByRole('radio', { name: /Select/i });
		const curveButton = canvas.getByRole('radio', { name: /Curve/i });

		await step('Initial state', async () => {
			// Initially, Select tool should be active (default state)
			await expect(selectButton).toHaveAttribute('aria-checked', 'true');
			await expect(curveButton).toHaveAttribute('aria-checked', 'false');
		});

		await step('Mouse interaction', async () => {
			// Click the Curve tool to activate it
			await userEvent.click(curveButton);
			await expect(curveButton).toHaveAttribute('aria-checked', 'true');
			await expect(selectButton).toHaveAttribute('aria-checked', 'false');

			// Click the Select tool again to reactivate it
			await userEvent.click(selectButton);
			await expect(selectButton).toHaveAttribute('aria-checked', 'true');
			await expect(curveButton).toHaveAttribute('aria-checked', 'false');

			// Clicking the Select tool again should be a no-op
			await userEvent.click(selectButton);
			await expect(selectButton).toHaveAttribute('aria-checked', 'true');
			await expect(curveButton).toHaveAttribute('aria-checked', 'false');
		});

		await step('Keyboard interaction', async () => {
			// Select Curve with the right arrow and select it with Enter
			await userEvent.keyboard('{ArrowRight}');
			await expect(curveButton).toHaveFocus();
			await userEvent.keyboard('{Enter}');
			await expect(curveButton).toHaveAttribute('aria-checked', 'true');
			await expect(selectButton).toHaveAttribute('aria-checked', 'false');

			// Select Select with the left arrow and select it with Space
			await userEvent.keyboard('{ArrowLeft}');
			await expect(selectButton).toHaveFocus();
			await userEvent.keyboard(' ');
			await expect(selectButton).toHaveAttribute('aria-checked', 'true');
			await expect(curveButton).toHaveAttribute('aria-checked', 'false');
		});
	}}
/>
