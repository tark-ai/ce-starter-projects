<script lang="ts">
import { formatPrice } from "@ce/little-things-ui/lib/format";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-svelte";
import { goto } from "$app/navigation";
import { checkout } from "$lib/checkout.svelte";
import type { LittleThingsRoute } from "$lib/little-things-routing";
import { routeToHref } from "$lib/little-things-routing";
import { wishlist } from "$lib/wishlist.svelte";
import StorefrontImage from "./StorefrontImage.svelte";
import Logo from "./Logo.svelte";

interface Props {
  categories: Array<{ name: string; slug?: string | null }>;
}

let { categories }: Props = $props();

let searchQuery = $state("");
let offCanvasType: "favorites" | null = $state(null);
let isMenuOpen = $state(false);

const EXPLORE_LINKS: Array<{ label: string; route: LittleThingsRoute }> = [
  { label: "Blog", route: { path: "/blog" } },
  { label: "About", route: { path: "/about" } },
  { label: "Contact", route: { path: "/contact" } },
];

// Open the favorites panel when an item is added to the wishlist.
$effect(() => {
  const unsubscribe = wishlist.onAdd(() => {
    offCanvasType = "favorites";
  });
  return unsubscribe;
});

function getCategorySlug(category: { name: string; slug?: string | null }) {
  return category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
}

function submitSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  searchQuery = "";
  isMenuOpen = false;
  goto(routeToHref({ path: "/search", search: { q: trimmed } }));
}

function openFavorites() {
  isMenuOpen = false;
  offCanvasType = "favorites";
}
</script>

<nav class="sticky top-0 z-40 w-full bg-nav/95 backdrop-blur-sm">
	<div class="mx-auto flex h-20 max-w-[1400px] items-center gap-4 px-6 lg:px-20">
		<!-- Left: dot-grid logo -->
		<a href={routeToHref({ path: '/' })} class="flex shrink-0 items-center">
			<Logo class="h-6 w-6 text-foreground" />
		</a>

		<!-- Center: prominent pill search -->
		<div class="flex min-w-0 flex-1 justify-center px-0 md:px-8">
			<div class="flex h-11 w-full max-w-xl items-center gap-2 rounded-full border border-border bg-background px-4">
				<Search class="size-4 shrink-0 text-muted-foreground" />
				<input
					type="search"
					placeholder="Search..."
					class="h-full w-full min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
					bind:value={searchQuery}
					onkeydown={(e) => {
						if (e.key === 'Enter') submitSearch(searchQuery);
					}}
					aria-label="Search products"
				/>
			</div>
		</div>

		<!-- Right: Overview + cart + menu -->
		<div class="flex shrink-0 items-center gap-3">
			<a
				href={routeToHref({ path: '/about' })}
				class="hidden text-sm text-nav-foreground transition-colors hover:text-nav-hover sm:block"
			>
				Overview
			</a>

			<button
				type="button"
				class="relative grid size-10 place-items-center rounded-full bg-secondary text-foreground transition-colors hover:bg-accent"
				aria-label="Shopping bag"
				onclick={() => checkout.openCart()}
			>
				<ShoppingBag class="size-4" />
				{#if checkout.cartCount > 0}
					<span
						class="pointer-events-none absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-brand text-[0.5rem] font-semibold text-brand-foreground"
					>
						{checkout.cartCount}
					</span>
				{/if}
			</button>

			<button
				type="button"
				class="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-secondary"
				aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (isMenuOpen = !isMenuOpen)}
			>
				{#if isMenuOpen}
					<X class="size-5" />
				{:else}
					<Menu class="size-5" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Full-width menu panel -->
	{#if isMenuOpen}
		<div class="absolute inset-x-0 top-full z-50 border-b border-border bg-nav">
			<div class="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-10 md:grid-cols-3 lg:px-20">
				<div>
					<p class="font-display text-2xl italic text-foreground">Shop</p>
					<ul class="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
						<li>
							<a
								href={routeToHref({ path: '/all-products' })}
								class="block py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
								onclick={() => (isMenuOpen = false)}
							>
								All products
							</a>
						</li>
						{#each categories as category (category.name)}
							<li>
								<a
									href={routeToHref({ path: `/category/${getCategorySlug(category)}` })}
									class="block py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
									onclick={() => (isMenuOpen = false)}
								>
									{category.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<p class="font-display text-2xl italic text-foreground">Explore</p>
					<ul class="mt-4 space-y-2">
						{#each EXPLORE_LINKS as link (link.label)}
							<li>
								<a
									href={routeToHref(link.route)}
									class="block py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
									onclick={() => (isMenuOpen = false)}
								>
									{link.label}
								</a>
							</li>
						{/each}
						<li>
							<button
								type="button"
								onclick={openFavorites}
								class="flex items-center gap-1.5 py-1 text-sm text-nav-foreground transition-colors hover:text-nav-hover"
							>
								<Heart class="size-4" /> Favorites{wishlist.count > 0 ? ` (${wishlist.count})` : ''}
							</button>
						</li>
					</ul>
				</div>

				<div>
					<p class="font-display text-2xl italic text-foreground">Latest drops</p>
					<p class="mt-4 max-w-xs text-sm text-muted-foreground">
						Search for the latest drops and products from Little Things.
					</p>
					<a
						href={routeToHref({ path: '/all-products' })}
						onclick={() => (isMenuOpen = false)}
						class="mt-6 inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
					>
						See all drops
					</a>
				</div>
			</div>
		</div>
	{/if}
</nav>

<!-- Favorites off-canvas -->
{#if offCanvasType === 'favorites'}
	<div class="fixed inset-0 z-50 h-screen">
		<button
			type="button"
			class="absolute inset-0 h-screen cursor-pointer border-0 bg-black/50 p-0"
			onclick={() => (offCanvasType = null)}
			aria-label="Close favorites panel"
		></button>

		<div class="absolute right-0 top-0 flex h-screen w-96 max-w-full flex-col border-l border-border bg-background animate-slide-in-right">
			<div class="flex items-center justify-between border-b border-border p-6">
				<h2 class="font-display text-2xl italic text-foreground">Your favorites</h2>
				<button
					type="button"
					onclick={() => (offCanvasType = null)}
					class="p-2 text-foreground transition-colors hover:text-muted-foreground"
					aria-label="Close"
				>
					<X size={20} />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-6">
				{#if wishlist.items.length === 0}
					<p class="text-sm text-muted-foreground">
						Nothing saved yet. Tap the heart on things you love and we'll keep them right here.
					</p>
				{:else}
					<div class="space-y-4">
						{#each wishlist.items as item (item.sku)}
							{@const itemRoute = {
								path: `/product/${item.product_slug}`,
								search: item.variant_slug ? { variant: item.variant_slug } : undefined,
							}}
							<div class="flex gap-4">
								<a
									href={routeToHref(itemRoute)}
									onclick={() => (offCanvasType = null)}
									class="shrink-0"
								>
									<StorefrontImage
										image={item.images?.[0]}
										alt={item.product_name}
										variant="thumbnail"
										width={80}
										height={80}
										class="size-20 bg-secondary object-contain"
									/>
								</a>
								<div class="min-w-0 flex-1">
									<a
										href={routeToHref(itemRoute)}
										onclick={() => (offCanvasType = null)}
										class="block"
									>
										<p class="truncate text-sm font-semibold text-foreground">
											{item.variant_name || item.product_name}
										</p>
										<p class="text-sm text-muted-foreground">
											{formatPrice(item.pricing.selling_price, item.pricing.currency)}
										</p>
									</a>
									<button
										type="button"
										onclick={() => wishlist.removeFromWishlist(item.product_id, item.variant_id)}
										class="mt-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
									>
										Remove
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
