<script lang="ts">
import { formatPrice } from "@ce/ui/lib/format";
import { images as defaultImages } from "@ce/ui/lib/images";
import { ArrowRight, X } from "lucide-svelte";
import { goto } from "$app/navigation";
import { checkout } from "$lib/checkout.svelte";
import type { LineaRoute } from "$lib/linea-routing";
import { routeToHref } from "$lib/linea-routing";
import { wishlist } from "$lib/wishlist.svelte";

interface Props {
  categories: Array<{ name: string; slug?: string | null }>;
}

let { categories }: Props = $props();

let activeDropdown: string | null = $state(null);
let dropdownCloseTimer: ReturnType<typeof setTimeout> | null = null;

function openDropdown(name: string) {
  if (dropdownCloseTimer) {
    clearTimeout(dropdownCloseTimer);
    dropdownCloseTimer = null;
  }
  activeDropdown = name;
}

function scheduleCloseDropdown() {
  if (dropdownCloseTimer) clearTimeout(dropdownCloseTimer);
  dropdownCloseTimer = setTimeout(() => {
    activeDropdown = null;
    dropdownCloseTimer = null;
  }, 150);
}

let isSearchOpen = $state(false);
let searchQuery = $state("");
let offCanvasType: "favorites" | null = $state(null);
let isMobileMenuOpen = $state(false);

const ringsCollection = defaultImages.ringsCollection;
const earringsCollection = defaultImages.earringsCollection;
const arcusBracelet = defaultImages.arcusBracelet;
const spanBracelet = defaultImages.spanBracelet;
const founders = defaultImages.founders;

// Registers a listener that opens the favorites panel when an item is added.
// This is an imperative event subscription, not derivable state, so $effect is correct.
$effect(() => {
  const unsubscribe = wishlist.onAdd(() => {
    offCanvasType = "favorites";
  });
  return unsubscribe;
});

let categoryNames = $derived(categories.map((category) => category.name));

function submitSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  isSearchOpen = false;
  searchQuery = "";
  goto(`/search?q=${encodeURIComponent(trimmed)}`);
}

const popularSearches = [
  "Gold Rings",
  "Silver Necklaces",
  "Pearl Earrings",
  "Designer Bracelets",
  "Wedding Rings",
  "Vintage Collection",
];

let navItems = $derived([
  {
    name: "Shop",
    href: "/category/shop",
    submenuItems: categoryNames.length > 0 ? categoryNames : ["All Products"],
    images: [
      { src: ringsCollection, alt: "Rings Collection", label: "Rings" },
      { src: earringsCollection, alt: "Earrings Collection", label: "Earrings" },
    ],
  },
  {
    name: "New in",
    href: "/category/new-in",
    submenuItems: [
      "This Week's Arrivals",
      "Spring Collection",
      "Featured Designers",
      "Limited Edition",
      "Pre-Orders",
    ],
    images: [
      { src: arcusBracelet, alt: "Arcus Bracelet", label: "Arcus Bracelet" },
      { src: spanBracelet, alt: "Span Bracelet", label: "Span Bracelet" },
    ],
  },
  {
    name: "About",
    href: "/about/our-story",
    submenuItems: ["Our Story", "Sustainability", "Size Guide", "Customer Care", "Store Locator"],
    images: [{ src: founders, alt: "Company Founders", label: "Read our story" }],
  },
]);

function getCategorySlug(name: string): string {
  const category = categories.find((entry) => entry.name === name);
  return category?.slug || name.toLowerCase().replace(/\s+/g, "-");
}

function getSubmenuRoute(groupName: string, subItem: string): LineaRoute {
  if (groupName === "About") {
    return { path: `/about/${subItem.toLowerCase().replace(/\s+/g, "-")}` };
  }
  if (groupName === "Shop") {
    return { path: `/category/${getCategorySlug(subItem)}` };
  }
  return { path: `/category/${subItem.toLowerCase()}` };
}

function getImageRoute(groupName: string, label: string): LineaRoute {
  if (groupName === "Shop") {
    if (label === "Rings") return { path: "/category/rings" };
    if (label === "Earrings") return { path: "/category/earrings" };
  }
  if (groupName === "New in") {
    if (label === "Arcus Bracelet") return { path: "/product/arcus-bracelet" };
    if (label === "Span Bracelet") return { path: "/product/span-bracelet" };
  }
  if (groupName === "About") {
    return { path: "/about/our-story" };
  }
  return { path: "/" };
}
</script>

<nav
	class="relative bg-background/90 backdrop-blur-sm"
>
	<div class="flex items-center justify-between h-16 px-6">
		<!-- Mobile hamburger -->
		<button
			type="button"
			class="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
			onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			aria-label="Toggle menu"
		>
			<div class="w-5 h-5 relative">
				<span
					class={[
						'absolute block w-5 h-px bg-current transform transition-all duration-300',
						isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1.5',
					]}
				></span>
				<span
					class={[
						'absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5',
						isMobileMenuOpen ? 'opacity-0' : 'opacity-100',
					]}
				></span>
				<span
					class={[
						'absolute block w-5 h-px bg-current transform transition-all duration-300',
						isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-3.5',
					]}
				></span>
			</div>
		</button>

		<!-- Desktop nav items -->
		<div class="hidden lg:flex space-x-8" role="menubar">
			{#each navItems as item (item.name)}
				<div
					class="relative"
					role="menuitem"
					tabindex="0"
					onmouseenter={() => openDropdown(item.name)}
					onmouseleave={scheduleCloseDropdown}
				>
					<a
						href={routeToHref({ path: item.href })}
						class="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light py-6 block"
					>
						{item.name}
					</a>
				</div>
			{/each}
		</div>

		<!-- Centered logo -->
		<div class="absolute left-1/2 transform -translate-x-1/2">
			<a href={routeToHref({ path: '/' })} class="block">
				<img src="/LINEA-1.svg" alt="LINEA" class="h-6 w-auto" />
			</a>
		</div>

		<!-- Right side icons -->
		<div class="flex items-center space-x-2">
			<!-- Search button -->
			<button
				type="button"
				class="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
				aria-label="Search"
				onclick={() => (isSearchOpen = !isSearchOpen)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5"
					role="img"
					aria-label="Search icon"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
			</button>

			<!-- Favorites button -->
			<button
				type="button"
				class="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
				aria-label="Favorites"
				onclick={() => (offCanvasType = 'favorites')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5"
					role="img"
					aria-label="Favorites icon"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
					/>
				</svg>
				{#if wishlist.count > 0}
					<span
						class="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[0.5rem] font-semibold rounded-full size-4 flex items-center justify-center pointer-events-none"
					>
						{wishlist.count}
					</span>
				{/if}
			</button>

			<!-- Cart button -->
			<button
				type="button"
				class="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
				aria-label="Shopping bag"
				onclick={() => checkout.openCart()}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="w-5 h-5"
					role="img"
					aria-label="Shopping bag icon"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
					/>
				</svg>
				{#if checkout.cartCount > 0}
					<span
						class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[30%] text-[0.5rem] font-semibold text-black pointer-events-none"
					>
						{checkout.cartCount}
					</span>
				{/if}
			</button>
		</div>
	</div>

	<!-- Desktop dropdown menu -->
	{#if activeDropdown}
		{@const activeItem = navItems.find((item) => item.name === activeDropdown)}
		{#if activeItem}
			<div
				class="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
				role="menu"
				tabindex="-1"
				onmouseenter={() => openDropdown(activeDropdown!)}
				onmouseleave={scheduleCloseDropdown}
			>
				<div class="px-6 py-8">
					<div class="flex justify-between w-full">
						<div class="flex-1">
							<ul class="space-y-2">
								{#each activeItem.submenuItems as subItem (subItem)}
									<li>
										<a
											href={routeToHref(getSubmenuRoute(activeDropdown, subItem))}
											class="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
										>
											{subItem}
										</a>
									</li>
								{/each}
							</ul>
						</div>

						<div class="flex space-x-6">
							{#each activeItem.images as image (image.src)}
								<a
									href={routeToHref(getImageRoute(activeDropdown, image.label))}
									class="w-[400px] h-[280px] cursor-pointer group relative overflow-hidden block"
								>
									<img
										src={image.src}
										alt={image.alt}
										width={400}
										height={280}
										loading="lazy"
										decoding="async"
										class="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
									/>
									<div
										class="absolute bottom-2 left-2 text-white text-xs font-light flex items-center gap-1"
									>
										<span>{image.label}</span>
										<ArrowRight size={12} />
									</div>
								</a>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/if}

	<!-- Search overlay -->
	{#if isSearchOpen}
		<div class="absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
			<div class="px-6 py-8">
				<div class="max-w-2xl mx-auto">
					<div class="relative mb-8">
						<div class="flex items-center border-b border-border pb-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="w-5 h-5 text-nav-foreground mr-3"
								role="img"
								aria-label="Search icon"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
							<input
								type="text"
								placeholder="Search for jewelry..."
								class="flex-1 bg-transparent text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg"
								bind:value={searchQuery}
								onkeydown={(e) => {
									if (e.key === 'Enter') submitSearch(searchQuery);
								}}
							/>
						</div>
					</div>

					<div>
						<h3 class="text-nav-foreground text-sm font-light mb-4">Popular Searches</h3>
						<div class="flex flex-wrap gap-3">
							{#each popularSearches as search (search)}
								<button
									type="button"
									class="text-nav-foreground hover:text-nav-hover text-sm font-light py-2 px-4 border border-border rounded-full transition-colors duration-200 hover:border-nav-hover"
									onclick={() => submitSearch(search)}
								>
									{search}
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Mobile menu -->
	{#if isMobileMenuOpen}
		<div class="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
			<div class="px-6 py-8">
				<div class="space-y-6">
					{#each navItems as item (item.name)}
						<div>
							<a
								href={routeToHref({ path: item.href })}
								class="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2"
								onclick={() => (isMobileMenuOpen = false)}
							>
								{item.name}
							</a>
							<div class="mt-3 pl-4 space-y-2">
								{#each item.submenuItems as subItem (subItem)}
									<a
										href={routeToHref(getSubmenuRoute(item.name, subItem))}
										class="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1"
										onclick={() => (isMobileMenuOpen = false)}
									>
										{subItem}
									</a>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

</nav>

<!-- Favorites off-canvas panel (outside nav to avoid stacking context issues) -->
{#if offCanvasType === 'favorites'}
	<div class="fixed inset-0 z-50 h-screen">
		<button
			type="button"
			class="absolute inset-0 bg-black/50 h-screen border-0 p-0 cursor-pointer"
			onclick={() => (offCanvasType = null)}
			aria-label="Close favorites panel"
		></button>

		<div
			class="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col"
		>
			<div class="flex items-center justify-between p-6 border-b border-border">
				<h2 class="text-lg font-light text-foreground">Your Favorites</h2>
				<button
					type="button"
					onclick={() => (offCanvasType = null)}
					class="p-2 text-foreground hover:text-muted-foreground transition-colors"
					aria-label="Close"
				>
					<X size={20} />
				</button>
			</div>

			<div class="flex-1 overflow-y-auto p-6">
				{#if wishlist.items.length === 0}
					<p class="text-muted-foreground text-sm">
						You haven't added any favorites yet. Browse our collection and click the heart icon
						to save items you love.
					</p>
				{:else}
					<div class="space-y-4">
						{#each wishlist.items as item (item.sku)}
							{@const itemRoute = {
								path: `/product/${item.product_slug}`,
								search: item.variant_slug ? { variant: item.variant_slug } : undefined,
							}}
							<div class="flex gap-4 group/item">
								<a
									href={routeToHref(itemRoute)}
									onclick={() => (offCanvasType = null)}
									class="shrink-0"
								>
									{#if item.images?.[0]}
										<img
											src={item.images[0].url_thumbnail}
											alt={item.product_name}
											width={80}
											height={80}
											loading="lazy"
											class="w-20 h-20 object-cover bg-muted/10"
										/>
									{:else}
										<div class="w-20 h-20 bg-muted/10"></div>
									{/if}
								</a>
								<div class="flex-1 min-w-0">
									<a
										href={routeToHref(itemRoute)}
										onclick={() => (offCanvasType = null)}
										class="block"
									>
										<p class="text-sm font-medium text-foreground truncate">
											{item.variant_name || item.product_name}
										</p>
										<p class="text-sm font-light text-muted-foreground">
											{formatPrice(item.pricing.selling_price, item.pricing.currency)}
										</p>
									</a>
									<button
										type="button"
										onclick={() => wishlist.removeFromWishlist(item.product_id, item.variant_id)}
										class="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
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
