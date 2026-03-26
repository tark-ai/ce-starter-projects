<script lang="ts">
import type {
  Item,
  Pagination as PaginationType,
  SearchProductsBody,
} from "@commercengine/storefront";
import { browser } from "$app/environment";
import { page as pageState } from "$app/state";
import FilterSortBar from "$lib/components/FilterSortBar.svelte";
import ProductGrid from "$lib/components/ProductGrid.svelte";
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
const hasUserFilters = $derived(Object.keys(filters).length > 0);

function buildFilter(userFilters: Record<string, unknown>): (string | string[])[] {
  const conditions: (string | string[])[] = [];

  const priceRange = userFilters.price_range as { min: number; max: number } | undefined;
  if (priceRange) {
    conditions.push(`pricing.selling_price ${priceRange.min} TO ${priceRange.max}`);
  }

  const minRating = userFilters.min_rating as number | undefined;
  if (minRating != null) {
    conditions.push(`rating >= ${minRating}`);
  }

  for (const [key, values] of Object.entries(userFilters)) {
    if (key === "price_range" || key === "min_rating") continue;
    if (!Array.isArray(values) || values.length === 0) continue;

    if (values.length === 1) {
      conditions.push(`${key} = '${values[0]}'`);
    } else {
      conditions.push(values.map((value: string) => `${key} = '${value}'`));
    }
  }

  return conditions;
}

let lastQuery = "";

$effect(() => {
  const q = query;
  if (q === lastQuery) return;
  lastQuery = q;

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

async function fetchResults(q: string, p: number, userFilters: Record<string, unknown>) {
  isLoading = true;

  const filter = buildFilter(userFilters);
  const body: SearchProductsBody = { query: q, page: p, limit: 20, facets: ["*"] };
  if (filter.length > 0) body.filter = filter;

  try {
    const { data, error } = await getSdk().catalog.searchProducts(body);
    if (error) {
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
    console.error("Failed to search:", e);
  } finally {
    isLoading = false;
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
	<meta name="description" content="Search the full LINEA jewelry collection." />
	<link rel="canonical" href={`${SITE_URL}/search`} />
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="pt-6 px-6">
	<div class="mb-8">
		<h1 class="text-3xl font-light text-foreground">
			{#if query}
				Search results for "{query}"
			{:else}
				Search
			{/if}
		</h1>
		{#if query && pagination}
			<p class="mt-2 text-sm font-light text-muted-foreground">
				{pagination.total_records} items
			</p>
		{/if}
		{#if query && skus.length === 0 && !isLoading}
			<p class="text-muted-foreground mt-4">
				No results found for "{query}". Try a different search term.
			</p>
		{/if}
	</div>

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
	{/if}

	{#if skus.length > 0}
		<ProductGrid {skus} {isLoading} {pagination} onpagechange={handlePageChange} />
	{/if}
</div>
