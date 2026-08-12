<script lang="ts">
import { formatPrice } from "@ce/soja-ui/lib/format";
import type { Item } from "@commercengine/storefront";
import { routeToHref } from "$lib/soja-routing";
import { cn } from "$lib/utils";
import { wishlist } from "$lib/wishlist.svelte";
import StorefrontImage from "./StorefrontImage.svelte";
import WishlistButton from "./WishlistButton.svelte";

interface Props {
  item: Item;
  /** Cards sit on photographic bands as well as on bone. */
  tone?: "default" | "onPhoto";
  showMeta?: boolean;
  class?: string;
}

let { item, tone = "default", showMeta = true, class: className = "" }: Props = $props();

const name = $derived(item.variant_name || item.product_name);
const primary = $derived(item.images?.[0]);
const secondary = $derived(item.images?.[1]);
const href = $derived(
  routeToHref({
    path: `/product/${item.product_slug}`,
    search: item.variant_slug ? { variant: item.variant_slug } : undefined,
  })
);
</script>

<!-- The favourite control is a sibling of the link, not a descendant: a button
     nested inside an anchor is invalid markup. -->
<div class={cn("group relative", className)}>
	<a {href} class="block">
		<div class="relative aspect-2/3 overflow-hidden bg-accent">
			<StorefrontImage
				image={primary}
				alt={primary?.alternate_text || name}
				variant="standard"
				class={cn(
					"h-full w-full object-cover transition-[opacity,transform] duration-700 ease-soja",
					secondary ? "group-hover:opacity-0" : "duration-[1200ms] group-hover:scale-[1.04]"
				)}
			/>

			{#if secondary}
				<StorefrontImage
					image={secondary}
					alt=""
					aria-hidden="true"
					variant="standard"
					class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 ease-soja group-hover:opacity-100"
				/>
			{/if}
		</div>

		{#if showMeta}
			<div class={cn("mt-4 flex flex-col gap-1", tone === "onPhoto" && "text-white")}>
				<h3 class="font-display text-body font-light tracking-display">{name}</h3>
				<p
					class={cn(
						"text-meta",
						tone === "onPhoto" ? "text-white/70" : "text-muted-foreground"
					)}
				>
					{formatPrice(item.pricing.selling_price, item.pricing.currency)}
				</p>
			</div>
		{/if}
	</a>

	<WishlistButton
		active={wishlist.isInWishlist(item.product_id, item.variant_id)}
		onclick={() => wishlist.toggleWishlist(item.product_id, item.variant_id)}
		class="absolute top-3 right-3 z-10"
	/>
</div>
