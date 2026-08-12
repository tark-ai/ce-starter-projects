<script lang="ts">
import { TABLET_MEDIA_QUERY } from "@ce/soja-ui/lib/breakpoints";
import type { Category } from "@commercengine/storefront";
import { Heart, Menu, Search, X } from "lucide-svelte";
import { onMount } from "svelte";
import { page } from "$app/state";
import { checkout } from "$lib/checkout.svelte";
import { routeToHref, type SojaRoute } from "$lib/soja-routing";
import { cn } from "$lib/utils";
import { wishlist } from "$lib/wishlist.svelte";
import Logo from "./Logo.svelte";
import WishlistPanel from "./WishlistPanel.svelte";

interface Props {
  categories?: Category[];
}

let { categories = [] }: Props = $props();

const NAV_LINKS: Array<{ label: string; route: SojaRoute }> = [
  { label: "Shop", route: { path: "/all-products" } },
  { label: "Our story", route: { path: "/about" } },
];

/** Header switches from transparent-over-photo to solid bone at this offset. */
const SCROLL_THRESHOLD = 80;

let scrolled = $state(false);
let menuOpen = $state(false);
let searchOpen = $state(false);
let favouritesOpen = $state(false);
let query = $state("");

const overHero = $derived(page.url.pathname === "/");
const onPhoto = $derived(overHero && !scrolled && !menuOpen);

const cartLabel = $derived(
  `Open cart, ${checkout.cartCount} ${checkout.cartCount === 1 ? "item" : "items"}`
);
const favouritesLabel = $derived(
  `Open favourites, ${wishlist.count} ${wishlist.count === 1 ? "item" : "items"}`
);

const categoryLinks = $derived(
  categories
    .filter((category) => category.slug)
    .slice(0, 6)
    .map((category) => ({ label: category.name, href: `/category/${category.slug}` }))
);

onMount(() => {
  const onScroll = () => {
    scrolled = window.scrollY > SCROLL_THRESHOLD;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
});

// Saving from anywhere on the page opens the panel, so the item is seen to land.
onMount(() =>
  wishlist.onAdd(() => {
    favouritesOpen = true;
  })
);

$effect(() => {
  if (!menuOpen && !favouritesOpen) return;
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = previous;
  };
});

// The drawer and its toggle are hidden from `tablet` up, so growing past the
// breakpoint would otherwise leave the scroll lock on with no way to clear it.
$effect(() => {
  if (!menuOpen) return;
  const mediaQuery = window.matchMedia(TABLET_MEDIA_QUERY);
  const closeIfWide = () => {
    if (mediaQuery.matches) menuOpen = false;
  };
  closeIfWide();
  mediaQuery.addEventListener("change", closeIfWide);
  return () => mediaQuery.removeEventListener("change", closeIfWide);
});

function submitSearch(event: SubmitEvent) {
  event.preventDefault();
  const trimmed = query.trim();
  if (!trimmed) return;
  searchOpen = false;
  menuOpen = false;
  query = "";
  window.location.href = routeToHref({ path: "/search", search: { q: trimmed } });
}

function openFavourites() {
  menuOpen = false;
  favouritesOpen = true;
}
</script>

<header
	class={cn(
		"sticky top-0 z-50 w-full transition-colors duration-500 ease-soja",
		onPhoto ? "bg-transparent text-white" : "bg-background text-foreground"
	)}
>
	<div class="soja-container flex h-20 items-center justify-between gap-6">
		<a href="/" class="shrink-0 transition-opacity hover:opacity-70">
			<Logo />
		</a>

		<nav class="hidden items-center gap-9 tablet:flex">
			{#each NAV_LINKS as link (link.label)}
				<a
					href={routeToHref(link.route)}
					class="text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
				>
					{link.label}
				</a>
			{/each}

			<button
				type="button"
				onclick={() => (searchOpen = !searchOpen)}
				aria-label="Search"
				aria-expanded={searchOpen}
				class="transition-opacity duration-300 ease-soja hover:opacity-60"
			>
				<Search class="h-4 w-4" strokeWidth={1.25} />
			</button>

			<button
				type="button"
				onclick={openFavourites}
				aria-label={favouritesLabel}
				class="relative transition-opacity duration-300 ease-soja hover:opacity-60"
			>
				<Heart class="h-4 w-4" strokeWidth={1.25} />
				{#if wishlist.count > 0}
					<span aria-hidden="true" class="absolute -top-2 -right-2 text-[0.625rem] leading-none">
						{wishlist.count}
					</span>
				{/if}
			</button>

			<button
				type="button"
				onclick={() => checkout.openCart()}
				aria-label={cartLabel}
				class="flex h-8 w-8 items-center justify-center rounded-full border border-current text-xs transition-opacity duration-300 ease-soja hover:opacity-60"
			>
				{checkout.cartCount}
			</button>
		</nav>

		<div class="flex items-center gap-5 tablet:hidden">
			<button
				type="button"
				onclick={openFavourites}
				aria-label={favouritesLabel}
				class="relative transition-opacity duration-300 ease-soja hover:opacity-60"
			>
				<Heart class="h-4 w-4" strokeWidth={1.25} />
				{#if wishlist.count > 0}
					<span aria-hidden="true" class="absolute -top-2 -right-2 text-[0.625rem] leading-none">
						{wishlist.count}
					</span>
				{/if}
			</button>

			<button
				type="button"
				onclick={() => checkout.openCart()}
				aria-label={cartLabel}
				class="flex h-8 w-8 items-center justify-center rounded-full border border-current text-xs transition-opacity duration-300 ease-soja hover:opacity-60"
			>
				{checkout.cartCount}
			</button>

			<button
				type="button"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={menuOpen ? "Close menu" : "Open menu"}
				aria-expanded={menuOpen}
			>
				{#if menuOpen}
					<X class="h-5 w-5" strokeWidth={1.25} />
				{:else}
					<Menu class="h-5 w-5" strokeWidth={1.25} />
				{/if}
			</button>
		</div>
	</div>

	<!-- A hairline drawer rather than a permanent field, so the two-link nav stays sparse. -->
	{#if searchOpen}
		<div class="hidden border-t border-border bg-background text-foreground tablet:block">
			<form onsubmit={submitSearch} class="soja-container py-5">
				<input
					type="search"
					bind:value={query}
					placeholder="Search"
					aria-label="Search products"
					class="w-full border-0 bg-transparent font-display text-title tracking-display outline-none placeholder:text-muted-foreground"
				/>
			</form>
		</div>
	{/if}

	{#if menuOpen}
		<div
			class="fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-background text-foreground tablet:hidden"
		>
			<div class="soja-container flex flex-col gap-10 py-10">
				<form onsubmit={submitSearch} class="border-b border-border pb-4">
					<input
						type="search"
						bind:value={query}
						placeholder="Search"
						aria-label="Search products"
						class="w-full border-0 bg-transparent font-display text-title tracking-display outline-none placeholder:text-muted-foreground"
					/>
				</form>

				<nav class="flex flex-col gap-6">
					{#each NAV_LINKS as link (link.label)}
						<a
							href={routeToHref(link.route)}
							onclick={() => (menuOpen = false)}
							class="font-display text-title tracking-display"
						>
							{link.label}
						</a>
					{/each}
					<button
						type="button"
						onclick={openFavourites}
						class="w-fit font-display text-title tracking-display"
					>
						Favourites{wishlist.count > 0 ? ` (${wishlist.count})` : ""}
					</button>
				</nav>

				{#if categoryLinks.length > 0}
					<div class="flex flex-col gap-4 border-t border-border pt-8">
						{#each categoryLinks as link (link.href)}
							<a
								href={link.href}
								onclick={() => (menuOpen = false)}
								class="text-meta text-muted-foreground"
							>
								{link.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<WishlistPanel open={favouritesOpen} onclose={() => (favouritesOpen = false)} />
</header>
