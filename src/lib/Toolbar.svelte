<script lang="ts">
	import { MousePointer, Tangent } from '@lucide/svelte';
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui';
	import Button from './Button.svelte';
	import { editor, selectTool } from './editor.svelte';
</script>

<ToggleGroupPrimitive.Root type="single" bind:value={() => editor.tool, selectTool}>
	{#snippet child({ props })}
		<div {...props} class="toolbar">
			<ToggleGroupPrimitive.Item value="select">
				{#snippet child({ props })}
					<Button {...props}>
						{#snippet icon()}
							<MousePointer size={20} />
						{/snippet}
						Select
					</Button>
				{/snippet}
			</ToggleGroupPrimitive.Item>

			<ToggleGroupPrimitive.Item value="curve">
				{#snippet child({ props })}
					<Button {...props}>
						{#snippet icon()}
							<Tangent size={20} />
						{/snippet}
						Curve
					</Button>
				{/snippet}
			</ToggleGroupPrimitive.Item>
		</div>
	{/snippet}
</ToggleGroupPrimitive.Root>

<style>
	.toolbar {
		position: relative;
		inline-size: fit-content;
		display: flex;
		flex-direction: row;
		align-items: stretch;
		padding-inline: 1rem;
		padding-block: 0.5rem;
		filter: drop-shadow(1px 2px 4px rgba(0 0 0 / 0.1));

		&::before {
			position: absolute;
			inset: 0;
			background-color: var(--linen);
			border-radius: 0.25rem;
			clip-path: shape(
				from 1rem top,
				line to calc(100% - 1rem) top,
				curve to right center with calc(100% - 0.2rem) top / right 0.2rem,
				curve to calc(100% - 1rem) bottom with right calc(100% - 0.2rem) / calc(100% - 0.2rem)
					bottom,
				line to 1rem bottom,
				curve to left center with 0.2rem bottom / left calc(100% - 0.2rem),
				curve to 1rem top with left 0.2rem / 0.2rem top
			);
		}
	}
</style>
