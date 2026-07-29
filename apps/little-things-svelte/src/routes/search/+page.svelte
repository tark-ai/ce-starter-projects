<script lang="ts">
import type {
  Item,
  Pagination as PaginationType,
  SearchProductsBody,
} from "@commercengine/storefront";
import { browser } from "$app/environment";
import { page as pageState } from "$app/state";
import FilterSortBar from "$lib/components/category/FilterSortBar.svelte";
import PlpHero from "$lib/components/category/PlpHero.svelte";
import ProductGrid from "$lib/components/category/ProductGrid.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";
import { getSdk } from "$lib/storefront";

let skus = $state<Item[]>([]);
let pagination = $state<PaginationType | undefined>(undefined);
let facetDist = $state<Record<string, Record<string, number>>>({});
let isLoading = $state(false);
let filters = $state<Record<string, unknown>>({});
let page = $state(1);
let baseFacetDistribution = $state<Record<string, Record<string, number>>>({});
let baseFacetStats = $state<Record<string, { min: number; max: number }>>({});

const query = $derived(browser ? (pageState.url.searchParams.get("q") ?? "") : "");
const currency = $derived(skus[0]?.pricing?.currency ?? "INR");

function buildFilter(userFilters: Record<string, unknown>): (string | string[])[] {
  const conditions: (string | string[])[] = [];

  const priceRange = userFilters.price_range as { min: number; max: number } | undefined;
  if (priceRange) {
    conditions.push(`pricing.selling_price ${priceRange.min} TO ${priceRange.max}`);
  }

  for (const [key, values] of Object.entries(userFilters)) {
    if (key === "price_range") continue;
    if (!Array.isArray(values) || values.length === 0) continue;
    if (values.length === 1) {
      conditions.push(`${key} = '${values[0]}'`);
    } else {
      conditions.push(values.map((v: string) => `${key} = '${v}'`));
    }
  }

  return conditions;
}

let lastQuery = "";

$effect(() => {
  const q = query;
  if (q === lastQuery) return;
  lastQuery = q;

  // Bump the request sequence so any in-flight request issued for the previous
  // query is treated as superseded and can't write stale results after reset.
  requestSeq++;

  filters = {};
  page = 1;
  skus = [];
  pagination = undefined;
  facetDist = {};
  baseFacetDistribution = {};
  baseFacetStats = {};
  isLoading = !!q;
});

$effect(() => {
  const currentPage = page;
  const currentFilters = filters;
  if (!query) return;
  fetchResults(query, currentPage, currentFilters);
});

// Monotonically increasing id per request. Rapid query/page/filter changes
// fire overlapping requests; only the latest one may apply its result so an
// older (slower) response can't overwrite a newer one.
let requestSeq = 0;

async function fetchResults(q: string, p: number, userFilters: Record<string, unknown>) {
  const seq = ++requestSeq;
  isLoading = true;

  const filter = buildFilter(userFilters);
  const body: SearchProductsBody = { query: q, page: p, limit: 20, facets: ["*"] };
  if (filter.length > 0) body.filter = filter;

  try {
    const { data, error } = await getSdk().catalog.searchProducts(body);
    // Drop the response if a newer request superseded this one, or if the query
    // it was issued for is no longer the current query (e.g. cleared to empty).
    if (seq !== requestSeq || q !== query) return;
    if (error) {
      // biome-ignore lint/suspicious/noConsole: surface search errors for debugging
      console.error("Search error:", error.message);
      return;
    }
    skus = data?.skus ?? [];
    pagination = data?.pagination;
    facetDist = (data?.facet_distribution as Record<string, Record<string, number>>) ?? {};

    if (Object.keys(baseFacetDistribution).length === 0 && Object.keys(facetDist).length > 0) {
      baseFacetDistribution = facetDist;
      baseFacetStats = (data?.facet_stats as Record<string, { min: number; max: number }>) ?? {};
    }
  } catch (e) {
    if (seq !== requestSeq || q !== query) return;
    // biome-ignore lint/suspicious/noConsole: surface search errors for debugging
    console.error("Failed to search:", e);
  } finally {
    if (seq === requestSeq) isLoading = false;
  }
}

function handlePageChange(newPage: number) {
  page = newPage;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleFiltersChange(newFilters: Record<string, unknown>) {
  filters = newFilters;
  page = 1;
}
</script>

<svelte:head>
	<title>Search | {SITE_NAME}</title>
	<meta name="description" content="Search the full Little Things catalog." />
	<link rel="canonical" href={`${SITE_URL}/search`} />
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<PlpHero query={query || undefined} />

<div class="pt-8">
	{#if query}
		<FilterSortBar
			itemCount={pagination?.total_records ?? 0}
			{currency}
			{baseFacetDistribution}
			{baseFacetStats}
			facetDistribution={facetDist}
			{filters}
			onfilterschange={handleFiltersChange}
		/>

		<ProductGrid {skus} {isLoading} {pagination} onpagechange={handlePageChange} />
	{:else}
		<section class="mx-auto w-full max-w-[1400px] px-6 lg:px-20">
			<p class="py-12 text-center text-sm font-light text-muted-foreground">
				Type something in the search bar above to find products.
			</p>
		</section>
	{/if}
</div>
