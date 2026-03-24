<script lang="ts">
import type {
  Item,
  Pagination as PaginationType,
  SearchProductsBody,
} from "@commercengine/storefront";
import { getSdk } from "$lib/storefront";
import CategoryHeader from "./CategoryHeader.svelte";
import FilterSortBar from "./FilterSortBar.svelte";
import ProductGrid from "./ProductGrid.svelte";

let {
  category,
  categorySlug = null,
  initialSkus = [],
  initialPagination,
}: {
  category: string;
  categorySlug?: string | null;
  initialSkus?: Item[];
  initialPagination?: PaginationType;
} = $props();

let clientSkus = $state<Item[] | null>(null);
let clientPagination = $state<PaginationType | undefined>(undefined);
let clientFacetDistribution = $state<Record<string, Record<string, number>> | null>(null);

let isLoading = $state(false);
let filters = $state<Record<string, unknown>>({});
let page = $state(1);
let baseFacetDistribution = $state<Record<string, Record<string, number>>>({});
let baseFacetStats = $state<Record<string, { min: number; max: number }>>({});

const skus = $derived(clientSkus ?? initialSkus);
const pagination = $derived(clientPagination ?? initialPagination);
const facetDistribution = $derived(clientFacetDistribution ?? baseFacetDistribution);
const currency = $derived(skus[0]?.pricing?.currency ?? "INR");
const hasUserFilters = $derived(Object.keys(filters).length > 0);

function buildFilter(userFilters: Record<string, unknown>): (string | string[])[] {
  const conditions: (string | string[])[] = [];

  // Only add category filter if we have a resolved slug (skip for "shop" / catch-all)
  if (categorySlug) {
    conditions.push(`categories.slug = '${categorySlug}'`);
  }

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
      conditions.push(values.map((v: string) => `${key} = '${v}'`));
    }
  }

  return conditions;
}

let baseFacetsLoaded = false;

$effect(() => {
  if (baseFacetsLoaded) return;
  baseFacetsLoaded = true;

  const filter = buildFilter({});
  const sdk = getSdk();

  sdk.catalog
    .searchProducts({ query: "", page: 1, limit: 1, facets: ["*"], filter })
    .then(({ data }) => {
      if (data?.facet_distribution) {
        baseFacetDistribution = data.facet_distribution as Record<string, Record<string, number>>;
      }
      if (data?.facet_stats) {
        baseFacetStats = data.facet_stats as Record<string, { min: number; max: number }>;
      }
      if (data?.facet_distribution && clientFacetDistribution === null) {
        clientFacetDistribution = data.facet_distribution as Record<string, Record<string, number>>;
      }
    })
    .catch((e) => {
      console.error("Failed to load base facets:", e);
    });
});

$effect(() => {
  const currentFilters = filters;
  const currentPage = page;
  const currentHasUserFilters = hasUserFilters;

  if (!currentHasUserFilters && currentPage === 1) {
    clientSkus = null;
    clientPagination = undefined;
    clientFacetDistribution = null;
    return;
  }

  const filter = buildFilter(currentFilters);
  const sdk = getSdk();

  isLoading = true;

  const body: SearchProductsBody = {
    query: "",
    page: currentPage,
    limit: 20,
    facets: ["*"],
    filter,
  };

  sdk.catalog
    .searchProducts(body)
    .then(({ data, error }) => {
      if (error) {
        console.error("Search error:", error.message);
        return;
      }
      clientSkus = data?.skus ?? [];
      clientPagination = data?.pagination;
      if (data?.facet_distribution) {
        clientFacetDistribution = data.facet_distribution as Record<string, Record<string, number>>;
      }
    })
    .catch((e) => {
      console.error("Failed to search products:", e);
    })
    .finally(() => {
      isLoading = false;
    });
});

function handlePageChange(newPage: number) {
  page = newPage;
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function handleFiltersChange(newFilters: Record<string, unknown>) {
  filters = newFilters;
  page = 1;
}
</script>

<CategoryHeader {category} />

<FilterSortBar
	itemCount={pagination?.total_records ?? 0}
	{currency}
	{baseFacetDistribution}
	{baseFacetStats}
	{facetDistribution}
	{filters}
	onfilterschange={handleFiltersChange}
/>

<ProductGrid {skus} {isLoading} {pagination} onpagechange={handlePageChange} />
