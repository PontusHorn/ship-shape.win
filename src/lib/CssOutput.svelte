<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import Button from './Button.svelte';
	import { copyTextToClipboard } from './util/copyTextToClipboard';
	import type { CssProperties } from './util/css';
	import { outputConfig } from './outputConfig.svelte';
	import { getShapeExtraCss } from './util/output';

	const { cssProperties }: { cssProperties: CssProperties } = $props();

	const extraCss = $derived(getShapeExtraCss(outputConfig.shapeProperty));

	let codeElement: HTMLElement;
</script>

<section aria-labelledby="css-output">
	<header>
		<h2 id="css-output">CSS output</h2>

		<fieldset>
			<legend class="visually-hidden">Code tools</legend>
			<div>
				<label for="shape-property">Target property:</label>
				<select id="shape-property" bind:value={outputConfig.shapeProperty}>
					<option>clip-path</option>
					<option>offset-path</option>
				</select>
			</div>

			<div>
				<label for="output">Code style:</label>
				<select id="output" bind:value={outputConfig.codeStyle}>
					<option value="default">Tweakable</option>
					<option value="minimal">Minimal</option>
				</select>
			</div>

			<div class="copy">
				<Button
					size="small"
					onclick={() => copyTextToClipboard(codeElement)}
					popovertarget="copied"
					--backgroundColor="var(--secondary-300)"
					--textColor="var(--secondary-800)"
				>
					{#snippet icon()}
						<Copy size={16} aria-hidden="true" />
					{/snippet}
					Copy to clipboard
				</Button>
			</div>
		</fieldset>
		<div id="copied" popover onanimationend={(e) => e.currentTarget.hidePopover()}>
			<Check aria-hidden="true" />
			Copied!
		</div>
	</header>

	<code bind:this={codeElement} data-testid="css-output"
		>{#each Object.entries(cssProperties) as [property, value] (property)}<span class="property"
				>{property}</span
			>:
			<span class="value">{value}</span>;{'\n'}{/each}{extraCss}</code
	>
</section>

<style>
	section {
		--border-radius: 1.5rem;
		--border-width: 4px;
		background-color: var(--secondary-400);
		border: var(--border-width) solid var(--secondary-400);
		border-radius: var(--border-radius);
		box-shadow: 1px 2px 4px var(--brand-300);
		overflow: clip;
	}

	header {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		padding: 1rem;
		color: var(--secondary-900);
		--focusRingColor: var(--brand-800);
	}

	fieldset {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: end;
		gap: 1rem;
	}

	.copy {
		anchor-name: --copy;
	}

	#copied:popover-open {
		position: absolute;
		position-anchor: --copy;
		position-area: block-start;
		display: flex;
		align-items: center;
		gap: 0.5em;
		margin: 0.25em;
		padding: 0.5em;

		background-color: var(--secondary-600);
		border: 2px solid transparent;
		border-radius: 0.5rem;
		color: var(--secondary-050);

		animation: fade-in-out 3s forwards;

		/* Show in center of screen when anchor positioning is not supported */
		@supports not (position-area: start start) {
			margin: auto;
		}
	}

	@keyframes fade-in-out {
		0% {
			opacity: 0;
			translate: 0 1rem;
		}

		5%,
		75% {
			opacity: 1;
			translate: none;
		}

		100% {
			opacity: 0;
		}
	}

	code {
		--inner-border-radius: calc(var(--border-radius) - var(--border-width));
		display: block;
		background-color: var(--secondary-100);
		border-start-start-radius: var(--inner-border-radius);
		border-start-end-radius: var(--inner-border-radius);
		color: var(--secondary-800);
		padding: 1rem;
		paint-order: stroke fill;
		overflow: auto;
		tab-size: 2;
		white-space: pre;
		anchor-name: --css-output;
	}

	.property {
		color: #15379a;
		font-weight: bold;
	}

	.value {
		color: #8d0560;
	}
</style>
