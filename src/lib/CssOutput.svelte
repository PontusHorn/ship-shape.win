<script lang="ts">
	import { Check, Copy } from '@lucide/svelte';
	import Button from './Button.svelte';
	import { copyTextToClipboard } from './util/copyTextToClipboard';
	import type { CssDeclarationBlock } from './util/css';
	import { outputConfig } from './outputConfig.svelte';

	const { cssDeclarationBlock }: { cssDeclarationBlock: CssDeclarationBlock } = $props();

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
					<option>border-shape</option>
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
					type="button"
					size="small"
					onclick={() => copyTextToClipboard(codeElement)}
					popovertarget="copied"
					--backgroundColor="var(--secondary-300)"
					--textColor="var(--secondary-800)"
				>
					{#snippet icon()}
						<Copy size={16} aria-hidden="true" absoluteStrokeWidth />
					{/snippet}
					Copy to clipboard
				</Button>
			</div>
		</fieldset>
		<div id="copied" popover onanimationend={(e) => e.currentTarget.hidePopover()}>
			<Check aria-hidden="true" absoluteStrokeWidth />
			Copied!
		</div>
	</header>

	{#if outputConfig.shapeProperty === 'border-shape'}
		<div class="border-shape-warning">
			<p>
				The <code>border-shape</code> property is experimental, and support is limited (at the time
				of writing). Validate that the
				<a href="https://caniuse.com/mdn-css_properties_border-shape">browser support</a> meets your
				targets and/or include an acceptable fallback when using.
			</p>
		</div>
	{/if}

	{#snippet declarationBlock(block: CssDeclarationBlock, indentLevel = 0)}
		{@const indent = '\t'.repeat(indentLevel)}
		{#each block as declaration (declaration)}
			{#if declaration.type === 'property'}
				{indent}<span class="property">{declaration.key}</span>:
				<span class="value">{declaration.value.replaceAll('\n', `\n${indent}`)}</span>;{'\n'}
			{:else if declaration.type === 'comment'}
				{indent}<span class="comment">/* {declaration.value} */</span>{'\n'}
			{:else if declaration.type === 'blank-line'}
				{'\n'}
			{:else if declaration.type === 'statement'}
				{indent}<span class="statement">{declaration.value}</span>{' {\n'}{@render declarationBlock(
					declaration.block,
					indentLevel + 1
				)}{`${indent}}\n`}
			{/if}
		{/each}
	{/snippet}

	<code class="output" bind:this={codeElement} data-testid="css-output">
		{@render declarationBlock(cssDeclarationBlock)}
	</code>
</section>

<style>
	section {
		--border-radius: 2rem;
		--border-width: 4px;
		background-color: var(--secondary-400);
		border: var(--border-width) solid var(--secondary-400);
		border-radius: var(--border-radius);
		box-shadow: 1px 2px 4px var(--brand-300);
		corner-shape: superellipse(-1);
		overflow: clip;
	}

	header {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		padding-block: 1rem;
		padding-inline: 2.5rem;
		color: var(--secondary-900);
		--focusRingColor: var(--brand-800);
	}

	fieldset {
		all: unset;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: end;
		gap: 1rem;
		text-align: end;
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
		border-radius: 1rem;
		color: var(--secondary-050);
		corner-shape: var(--cornerShape);

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

	.border-shape-warning {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.5em;

		&::before {
			content: '⚠️';
			font-size: 1.5em;
		}

		p {
			text-wrap: balance;
		}
	}

	.output {
		--inner-border-radius: calc(var(--border-radius) - var(--border-width));
		display: block;
		background-color: var(--secondary-100);
		border-radius: var(--inner-border-radius);
		color: var(--secondary-800);
		corner-shape: var(--cornerShape);
		padding: 1rem;
		padding-block-end: calc(1rem + 1lh);
		paint-order: stroke fill;
		overflow: auto;
		tab-size: 2;
		white-space: pre;
		anchor-name: --css-output;
	}

	.statement {
		color: #15379a;
	}

	.property {
		color: #15379a;
		font-weight: bold;
	}

	.value {
		color: #8d0560;
	}
</style>
