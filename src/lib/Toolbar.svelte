<script lang="ts">
	import { MousePointer, Tangent } from '@lucide/svelte';
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui';
	import Button from './Button.svelte';
	import { editor } from './editor/Editor.svelte';
	import { disableUntilHydrated } from './util/disableUntilHydrated';
</script>

<ToggleGroupPrimitive.Root
	type="single"
	bind:value={() => editor.tool, (tool) => (editor.tool = tool)}
>
	{#snippet child({ props })}
		<div {...props} class="toolbar">
			<!-- Easier to style the toolbar using the Button component in this case -->
			{@html `<!-- [html-validate-disable-block prefer-native-element] -->`}

			<ToggleGroupPrimitive.Item value="select">
				{#snippet child({ props })}
					<Button {...props} {...disableUntilHydrated()} type="button">
						{#snippet icon()}
							<MousePointer size={20} aria-hidden="true" absoluteStrokeWidth />
						{/snippet}
						Select
					</Button>
				{/snippet}
			</ToggleGroupPrimitive.Item>

			<ToggleGroupPrimitive.Item value="curve">
				{#snippet child({ props })}
					<Button {...props} {...disableUntilHydrated()} type="button">
						{#snippet icon()}
							<Tangent size={20} aria-hidden="true" absoluteStrokeWidth />
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
