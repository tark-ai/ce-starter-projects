<script lang="ts">
import { formatPrice } from "@ce/ui/lib/format";
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import { routeToHref } from "$lib/linea-routing";
import { wishlist } from "$lib/wishlist.svelte";
import PaginationComponent from "./Pagination.svelte";

let {
  skus,
  isLoading = false,
  pagination,
  onpagechange,
}: {
  skus: Item[];
  isLoading?: boolean;
  pagination?: PaginationType;
  onpagechange: (page: number) => void;
} = $props();

function resolveImageSrc(
  image: Item["images"] extends (infer T)[] | undefined ? T : never
): string | null {
  if (!image) return null;
  return image.url_standard || image.url_zoom || image.url_thumbnail || image.url_tiny || null;
}

const skeletonIds = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
</script>

{#if isLoading}
	<section class="w-full px-6 mb-16">
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
			{#each skeletonIds as id (id)}
				<div>
					<div class="aspect-square bg-muted/20 animate-pulse mb-3"></div>
					<div class="h-4 w-20 bg-muted/20 animate-pulse mb-1"></div>
					<div class="h-4 w-32 bg-muted/20 animate-pulse"></div>
				</div>
			{/each}
		</div>
	</section>
{:else if skus.length === 0}
	<section class="w-full px-6 mb-16">
		<p class="text-sm font-light text-muted-foreground py-12 text-center">
			No products found.
		</p>
	</section>
{:else}
	<section class="w-full px-6 mb-16">
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
			{#each skus as item (item.sku)}
				{@const href = routeToHref({
					path: `/product/${item.product_slug}`,
					search: item.variant_slug ? { variant: item.variant_slug } : undefined
				})}
				{@const primaryImage = item.images?.[0]}
				{@const secondaryImage = item.images?.[1] || item.images?.[0]}
				{@const primarySrc = resolveImageSrc(primaryImage)}
				{@const secondarySrc = resolveImageSrc(secondaryImage)}
				{@const isWishlisted = wishlist.isInWishlist(item.product_id, item.variant_id)}

				<a {href} class="group cursor-pointer block">
					<div class="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
						{#if primarySrc}
							<img
								src={primarySrc}
								alt={primaryImage?.alternate_text || item.product_name}
								sizes="(max-width: 768px) calc(50vw - 24px), (max-width: 1024px) calc(33vw - 24px), calc(25vw - 24px)"
								width={400}
								height={400}
								loading="lazy"
								decoding="async"
								class="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
							/>
						{/if}
						{#if secondarySrc}
							<img
								src={secondarySrc}
								alt="{item.product_name} alternate"
								sizes="(max-width: 768px) calc(50vw - 24px), (max-width: 1024px) calc(33vw - 24px), calc(25vw - 24px)"
								width={400}
								height={400}
								loading="lazy"
								decoding="async"
								class="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
							/>
						{/if}
						<div class="absolute inset-0 bg-black/[0.03]"></div>
						<button
							type="button"
							class="absolute top-2 right-2 p-1.5 z-10"
							aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
							onclick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								wishlist.toggleWishlist(item.product_id, item.variant_id);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								class="h-5 w-5 {isWishlisted
									? 'fill-foreground stroke-foreground'
									: 'fill-none stroke-foreground/70'}"
								stroke-width="1.5"
							>
								<path
									d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
								/>
							</svg>
						</button>
					</div>
					<div class="space-y-1">
						<p class="text-sm font-light text-foreground">{item.categories?.[0]?.name}</p>
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
			{/each}
		</div>

		{#if pagination && pagination.total_pages > 1}
			<PaginationComponent {pagination} {onpagechange} />
		{/if}
	</section>
{/if}
