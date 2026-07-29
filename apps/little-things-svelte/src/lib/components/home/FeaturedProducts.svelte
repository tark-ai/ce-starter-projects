<script lang="ts">
import type { Item } from "@commercengine/storefront";
import { routeToHref } from "$lib/little-things-routing";
import StorefrontImage from "../StorefrontImage.svelte";

interface Props {
  items: Item[];
  isLoading?: boolean;
}

let { items, isLoading = false }: Props = $props();

const skeletonIds = ["f1", "f2", "f3"];
</script>

{#if isLoading}
	<section class="mx-auto w-full max-w-[1400px] px-6 py-6 lg:px-20">
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
			{#each skeletonIds as id (id)}
				<div class="aspect-[4/5] animate-pulse bg-secondary"></div>
			{/each}
		</div>
	</section>
{:else if items.length > 0}
	<section class="mx-auto w-full max-w-[1400px] px-6 py-6 lg:px-20">
		<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
			{#each items.slice(0, 3) as item (`${item.product_id}:${item.variant_id ?? 'product'}`)}
				<a
					href={routeToHref({
						path: `/product/${item.product_slug}`,
						search: item.variant_slug ? { variant: item.variant_slug } : undefined,
					})}
					class="group flex flex-col bg-secondary p-8"
				>
					<div class="flex flex-1 items-center justify-center">
						<StorefrontImage
							image={item.images?.[0]}
							alt={item.images?.[0]?.alternate_text || item.product_name}
							variant="standard"
							width={560}
							height={560}
							class="max-h-72 w-full object-contain transition-transform duration-500 group-hover:scale-105"
						/>
					</div>
					<div class="mt-6 text-center">
						{#if item.categories?.[0]?.name}
							<p class="text-sm text-muted-foreground">{item.categories[0].name}</p>
						{/if}
						<p class="mt-0.5 text-sm font-semibold text-foreground">
							{item.variant_name || item.product_name}
						</p>
					</div>
				</a>
			{/each}
		</div>
	</section>
{/if}
