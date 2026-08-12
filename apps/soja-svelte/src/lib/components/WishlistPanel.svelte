<script lang="ts">
import { formatPrice } from "@ce/soja-ui/lib/format";
import { X } from "lucide-svelte";
import { routeToHref } from "$lib/soja-routing";
import { wishlist } from "$lib/wishlist.svelte";
import StorefrontImage from "./StorefrontImage.svelte";

interface Props {
  open: boolean;
  onclose: () => void;
}

let { open, onclose }: Props = $props();

function hrefFor(item: { product_slug: string; variant_slug?: string | null }) {
  return routeToHref({
    path: `/product/${item.product_slug}`,
    search: item.variant_slug ? { variant: item.variant_slug } : undefined,
  });
}
</script>

<svelte:window onkeydown={(event) => open && event.key === "Escape" && onclose()} />

{#if open}
	<div class="fixed inset-0 z-50">
		<button
			type="button"
			onclick={onclose}
			aria-label="Close favourites"
			class="absolute inset-0 h-full w-full cursor-default bg-black/40"
		></button>

		<aside
			aria-label="Favourites"
			class="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-border bg-background text-foreground"
		>
			<div class="flex items-center justify-between gap-6 border-b border-border px-6 py-6">
				<h2 class="font-display text-title tracking-display">Favourites</h2>
				<button
					type="button"
					onclick={onclose}
					aria-label="Close favourites"
					class="transition-opacity duration-300 ease-soja hover:opacity-60"
				>
					<X class="h-5 w-5" strokeWidth={1.25} />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto px-6 py-8">
				{#if wishlist.items.length === 0}
					<p class="max-w-[280px] text-meta leading-relaxed text-muted-foreground">
						Nothing saved yet. Tap the heart on a formulation and it will wait for you here.
					</p>
				{:else}
					<ul class="flex flex-col gap-8">
						{#each wishlist.items as item (item.sku ?? `${item.product_id}-${item.variant_id}`)}
							<li class="flex gap-4">
								<a href={hrefFor(item)} onclick={onclose} class="shrink-0">
									<StorefrontImage
										image={item.images?.[0]}
										alt={item.product_name}
										variant="thumbnail"
										class="aspect-2/3 w-16 bg-accent object-cover"
									/>
								</a>

								<div class="flex min-w-0 flex-1 flex-col gap-1">
									<a
										href={hrefFor(item)}
										onclick={onclose}
										class="text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
									>
										{item.variant_name || item.product_name}
									</a>
									<p class="text-meta text-muted-foreground">
										{formatPrice(item.pricing.selling_price, item.pricing.currency)}
									</p>
									<button
										type="button"
										onclick={() => wishlist.removeFromWishlist(item.product_id, item.variant_id)}
										class="mt-2 w-fit text-meta text-muted-foreground underline underline-offset-4 transition-colors duration-300 ease-soja hover:text-foreground"
									>
										Remove
									</button>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</aside>
	</div>
{/if}
