<script lang="ts">
import { formatPrice } from "@ce/ui/lib/format";
import type { Item } from "@commercengine/storefront";
import { routeToHref } from "$lib/linea-routing";
import { wishlist } from "$lib/wishlist.svelte";
import StorefrontImage from "./StorefrontImage.svelte";
import WishlistButton from "./WishlistButton.svelte";

interface Props {
  items: Item[];
  isLoading?: boolean;
}

let { items, isLoading = false }: Props = $props();

const skeletonIds = ["c1", "c2", "c3", "c4"];

function getItemHref(item: Item): string {
  return routeToHref({
    path: `/product/${item.product_slug}`,
    search: item.variant_slug ? { variant: item.variant_slug } : undefined,
  });
}

function handleWishlistClick(e: MouseEvent, item: Item) {
  e.preventDefault();
  e.stopPropagation();
  wishlist.toggleWishlist(item.product_id, item.variant_id);
}
</script>

{#if isLoading}
	<section class="w-full mb-16 px-6">
		<div class="flex gap-4">
			{#each skeletonIds as id (id)}
				<div class="basis-1/2 md:basis-1/3 lg:basis-1/4 shrink-0">
					<div class="aspect-square bg-muted/20 animate-pulse mb-3"></div>
					<div class="h-4 w-20 bg-muted/20 animate-pulse mb-1"></div>
					<div class="h-4 w-32 bg-muted/20 animate-pulse"></div>
				</div>
			{/each}
		</div>
	</section>
{:else}
	<section class="w-full mb-16 px-6">
		<div class="flex w-full overflow-x-auto scroll-snap-x-mandatory gap-2 md:gap-4">
			{#each items as item (`${item.product_id}:${item.variant_id ?? 'product'}`)}
				<div class="basis-1/2 md:basis-1/3 lg:basis-1/4 shrink-0 snap-start">
					<a href={getItemHref(item)} class="block group">
						<div class="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
							<StorefrontImage
								image={item.images?.[0]}
								alt={item.images?.[0]?.alternate_text || item.product_name}
								variant="standard"
								sizes="(max-width: 768px) calc(50vw - 32px), (max-width: 1024px) calc(33vw - 32px), calc(25vw - 32px)"
								width={400}
								height={400}
								loading="lazy"
								class="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
							/>
							<StorefrontImage
								image={item.images?.[1] || item.images?.[0]}
								alt="{item.variant_name || item.product_name} alternate"
								variant="standard"
								sizes="(max-width: 768px) calc(50vw - 32px), (max-width: 1024px) calc(33vw - 32px), calc(25vw - 32px)"
								width={400}
								height={400}
								loading="lazy"
								class="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
							/>
							<div class="absolute inset-0 bg-black/[0.03]"></div>
							<WishlistButton
								active={wishlist.isInWishlist(item.product_id, item.variant_id)}
								onclick={(e) => handleWishlistClick(e, item)}
							/>
						</div>
						<div class="space-y-1">
							<p class="text-sm font-light text-foreground">
								{item.categories?.[0]?.name}
							</p>
							<div class="flex justify-between items-center">
								<h3 class="text-sm font-medium text-foreground">
									{item.variant_name || item.product_name}
								</h3>
								<p class="text-sm font-light text-foreground">
									{formatPrice(item.pricing.selling_price, item.pricing.currency)}
								</p>
							</div>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	.scroll-snap-x-mandatory {
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
	}
	.snap-start {
		scroll-snap-align: start;
	}
</style>
