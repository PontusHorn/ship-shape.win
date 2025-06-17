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
		display: flex;
		align-items: stretch;
	}
</style>
