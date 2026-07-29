<script lang="ts">
import { formatPrice } from "@ce/little-things-ui/lib/format";
import type { Item } from "@commercengine/storefront";
import { routeToHref } from "$lib/little-things-routing";
import { wishlist } from "$lib/wishlist.svelte";
import StorefrontImage from "./StorefrontImage.svelte";
import WishlistButton from "./WishlistButton.svelte";

interface Props {
  item: Item;
}

let { item }: Props = $props();

const inStock = $derived(item.stock_available || Boolean(item.backorder));
const href = $derived(
  routeToHref({
    path: `/product/${item.product_slug}`,
    search: item.variant_slug ? { variant: item.variant_slug } : undefined,
  })
);

function handleWishlistClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  wishlist.toggleWishlist(item.product_id, item.variant_id);
}
</script>

<a {href} class="group block">
	<div class="relative flex aspect-square items-center justify-center overflow-hidden bg-secondary p-8">
		<StorefrontImage
			image={item.images?.[0]}
			alt={item.images?.[0]?.alternate_text || item.product_name}
			variant="standard"
			width={480}
			height={480}
			class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
		/>
		{#if !inStock}
			<span
				class="absolute left-3 top-3 inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground ring-1 ring-border"
			>
				Last chance
			</span>
		{/if}
		<WishlistButton
			active={wishlist.isInWishlist(item.product_id, item.variant_id)}
			onclick={handleWishlistClick}
		/>
	</div>
	<div class="mt-4 text-center">
		{#if item.categories?.[0]?.name}
			<p class="text-sm text-muted-foreground">{item.categories[0].name}</p>
		{/if}
		<h3 class="mt-0.5 text-sm font-semibold text-foreground transition-colors group-hover:text-brand">
			{item.variant_name || item.product_name}
		</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			{formatPrice(item.pricing.selling_price, item.pricing.currency)}
		</p>
	</div>
</a>
