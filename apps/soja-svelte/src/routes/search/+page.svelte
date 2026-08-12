<script lang="ts">
import type { Item, Pagination } from "@commercengine/storefront";
import { afterNavigate } from "$app/navigation";
import PlpHero from "$lib/components/category/PlpHero.svelte";
import ProductGrid from "$lib/components/category/ProductGrid.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";
import { getSdk } from "$lib/storefront";

const PAGE_SIZE = 12;

// The page is prerendered, and SvelteKit forbids reading url.searchParams during
// prerender, so the query is read from the browser after navigation instead.
let query = $state("");
let ready = $state(false);
let currentPage = $state(1);
let skus = $state<Item[]>([]);
let pagination = $state<Pagination | undefined>(undefined);
let isLoading = $state(false);

afterNavigate(() => {
  const next = new URLSearchParams(window.location.search).get("q") ?? "";
  if (next !== query) currentPage = 1;
  query = next;
  ready = true;
});

$effect(() => {
  if (!query) {
    skus = [];
    pagination = undefined;
    return;
  }

  let cancelled = false;
  isLoading = true;

  getSdk()
    .catalog.searchProducts({ query, page: currentPage, limit: PAGE_SIZE })
    .then(({ data, error }) => {
      if (cancelled) return;
      if (error) throw new Error(error.message);
      skus = data?.skus ?? [];
      pagination = data?.pagination;
    })
    .catch((error) => {
      if (cancelled) return;
      // biome-ignore lint/suspicious/noConsole: surface search failures
      console.error("Search failed:", error);
      skus = [];
    })
    .finally(() => {
      if (!cancelled) isLoading = false;
    });

  return () => {
    cancelled = true;
  };
});

function changePage(next: number) {
  currentPage = next;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<svelte:head>
	<title>Search | {SITE_NAME}</title>
	<meta
		name="description"
		content={`Search the full ${SITE_NAME} catalog by name, ingredient or ritual.`}
	/>
	<meta name="robots" content="noindex, follow" />
	<link rel="canonical" href={`${SITE_URL}/search`} />
</svelte:head>

<main>
	<PlpHero
		title="Search"
		query={query || undefined}
		subtitle={query ? undefined : "Search our formulations by name, ingredient or ritual."}
	/>
	<ProductGrid
		{skus}
		isLoading={!ready || isLoading}
		{pagination}
		onpagechange={changePage}
		emptyMessage={query
			? `Nothing matched “${query}”.`
			: "Start typing to search the collection."}
	/>
</main>
