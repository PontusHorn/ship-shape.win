<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import CssOutput from './CssOutput.svelte';

	const { Story } = defineMeta({
		title: 'CssOutput',
		component: CssOutput
	});
</script>

<Story
	name="Single rule"
	args={{ cssProperties: { foo: 'bar' } }}
	play={async ({ canvasElement }) => {
		const expectedCode = 'foo: bar;\n';

		const canvas = within(canvasElement);
		const code = canvas.getByRole('code');
		await expect(code.innerText).toBe(expectedCode);

		const button = canvas.getByRole('button', { name: 'Copy to clipboard' });
		await expect(button).toBeInTheDocument();

		await userEvent.click(button);
		await expect(await navigator.clipboard.readText()).toBe(expectedCode);
	}}
/>

<Story
	name="Multiple rules"
	args={{ cssProperties: { foo: 'bar', baz: 'quux' } }}
	play={async ({ canvasElement }) => {
		const expectedCode = 'foo: bar;\nbaz: quux;\n';

		const canvas = within(canvasElement);
		const code = canvas.getByRole('code');
		await expect(code.innerText).toBe(expectedCode);

		const button = canvas.getByRole('button', { name: 'Copy to clipboard' });
		await expect(button).toBeInTheDocument();

		await userEvent.click(button);
		await expect(await navigator.clipboard.readText()).toBe(expectedCode);
	}}
/>
