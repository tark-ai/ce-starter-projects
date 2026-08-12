<script lang="ts">
import { cn } from "$lib/utils";

interface Item {
  label: string;
  href: string;
  active?: boolean;
}

let { items }: { items: Item[] } = $props();
</script>

{#if items.length > 0}
	<nav class="soja-container flex flex-wrap gap-x-8 gap-y-3 border-b border-border pb-6">
		{#each items as item (item.label)}
			<a
				href={item.href}
				aria-current={item.active ? "page" : undefined}
				class={cn(
					"text-meta transition-opacity duration-300 ease-soja hover:opacity-60",
					item.active ? "underline underline-offset-[6px]" : "text-muted-foreground"
				)}
			>
				{item.label}
			</a>
		{/each}
	</nav>
{/if}
