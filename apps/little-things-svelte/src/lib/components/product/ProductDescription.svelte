<script lang="ts">
import type { Product } from "@commercengine/storefront";
import { Check } from "lucide-svelte";

interface Props {
  product: Product;
}

let { product }: Props = $props();
</script>

{#if product.short_description || product.attributes.length > 0}
	<div class="mt-8 max-w-none">
		{#if product.short_description}
			<p class="text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
		{/if}
		{#if product.attributes.length > 0}
			<ul class="mt-4 space-y-2">
				{#each product.attributes as attr (attr.key)}
					<li class="flex items-start gap-2 text-sm text-foreground">
						<Check class="mt-0.5 h-4 w-4 shrink-0 text-brand" />
						<span>
							<span class="capitalize text-muted-foreground">{attr.name}:</span>
							{String(attr.value)}
						</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
{/if}
