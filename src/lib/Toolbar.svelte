<script lang="ts">
	import { MousePointer, Tangent } from '@lucide/svelte';
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui';
	import Button from './Button.svelte';
	import { editor } from './editor/editor.svelte';
	import { disableUntilHydrated } from './util/disableUntilHydrated';
</script>

<ToggleGroupPrimitive.Root
	type="single"
	bind:value={() => editor.tool, (tool) => (editor.tool = tool)}
>
	{#snippet child({ props })}
		<div {...props} class="toolbar">
			<ToggleGroupPrimitive.Item value="select">
				{#snippet child({ props })}
					<Button {...props} {...disableUntilHydrated()}>
						{#snippet icon()}
							<MousePointer size={20} aria-hidden="true" />
						{/snippet}
						Select
					</Button>
				{/snippet}
			</ToggleGroupPrimitive.Item>

			<ToggleGroupPrimitive.Item value="curve">
				{#snippet child({ props })}
					<Button {...props} {...disableUntilHydrated()}>
						{#snippet icon()}
							<Tangent size={20} aria-hidden="true" />
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
		justify-content: center;
	}
</style>
