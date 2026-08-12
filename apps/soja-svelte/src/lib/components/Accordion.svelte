<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";

interface AccordionItem {
  id: string;
  label: string;
}

interface Props {
  items: AccordionItem[];
  panel: Snippet<[AccordionItem]>;
  class?: string;
}

let { items, panel, class: className = "" }: Props = $props();

// Single-open and collapsible, matching the Radix accordion the React apps use.
let openId = $state<string | null>(null);
</script>

<div class={cn("border-t border-border", className)}>
	{#each items as item (item.id)}
		<div class="border-b border-border">
			<h3 class="flex">
				<button
					type="button"
					id={`accordion-trigger-${item.id}`}
					onclick={() => (openId = openId === item.id ? null : item.id)}
					aria-expanded={openId === item.id}
					aria-controls={`accordion-panel-${item.id}`}
					class="group flex flex-1 items-center justify-between gap-6 py-6 text-left text-body transition-opacity duration-300 ease-soja hover:opacity-60"
				>
					{item.label}
					<span aria-hidden="true" class="relative h-3 w-3 shrink-0 text-muted-foreground">
						<span class="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current"></span>
						<span
							class={cn(
								"absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-soja",
								openId === item.id && "scale-y-0"
							)}
						></span>
					</span>
				</button>
			</h3>

			{#if openId === item.id}
				<div
					id={`accordion-panel-${item.id}`}
					role="region"
					aria-labelledby={`accordion-trigger-${item.id}`}
					class="overflow-hidden text-meta text-foreground/70"
				>
					<div class="max-w-[600px] pb-8 leading-relaxed">
						{@render panel(item)}
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
