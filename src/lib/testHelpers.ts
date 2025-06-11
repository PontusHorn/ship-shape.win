import { expect, waitFor, within } from 'storybook/test';

export async function withinShadowRoot(customElement: HTMLElement, selector: string) {
	const customEl = customElement.querySelector(selector);

	await waitFor(
		() => {
			const shadowRootFirstEl = customEl?.shadowRoot?.firstElementChild as HTMLElement;
			return expect(shadowRootFirstEl).toContainElement(shadowRootFirstEl);
		},
		{ timeout: 1000 }
	);

	// force type HTMLElement to ignore the type checking of the "within" function
	return within(customEl?.shadowRoot as unknown as HTMLElement);
}
