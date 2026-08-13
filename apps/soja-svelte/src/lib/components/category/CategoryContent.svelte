<script lang="ts">
import type { Category, Item, Pagination } from "@commercengine/storefront";
import { buildFilter } from "$lib/build-filter";
import { getSdk } from "$lib/storefront";
import { PLP_COPY, SHOP_CATEGORIES } from "$lib/site-content";
import CategoryFilterRow from "./CategoryFilterRow.svelte";
import PlpHero from "./PlpHero.svelte";
import ProductGrid from "./ProductGrid.svelte";
import SortSelect from "./SortSelect.svelte";
import BrandPillars from "../home/BrandPillars.svelte";

const PAGE_SIZE = 12;

interface Props {
  categorySlug?: string | null;
  categoryName?: string;
  categoryDescription?: string;
  categories?: Category[];
  initialSkus: Item[];
  initialPagination?: Pagination;
}

let {
  categorySlug = null,
  categoryName,
  categoryDescription,
  categories = [],
  initialSkus,
  initialPagination,
}: Props = $props();

let page = $state(1);
let sort = $state("");
let fetched = $state<{ skus: Item[]; pagination?: Pagination } | null>(null);
// A failed loader read is indistinguishable from an empty catalog, so start in the
// loading state the recovery request below is about to enter — otherwise the first
// frame shows the empty-collection message.
// svelte-ignore state_referenced_locally
let isLoading = $state(initialSkus.length === 0);
// Only the newest request may commit results or clear the loading flag.
let requestSeq = 0;
// Non-reactive so starting the recovery request can't re-trigger the effect below.
let requested = false;

// An empty initial set is indistinguishable from a failed loader read, so treat it
// as missing and let the client request recover.
const usingInitialData = $derived(initialSkus.length > 0 && page === 1 && sort === "");
const skus = $derived(usingInitialData ? initialSkus : (fetched?.skus ?? []));
const pagination = $derived(usingInitialData ? initialPagination : fetched?.pagination);

const filterItems = $derived.by(() => {
  const referenceSlugs = new Set<string>(SHOP_CATEGORIES.map((entry) => entry.slug));
  const extras = categories
    .filter((entry) => entry.slug && !referenceSlugs.has(entry.slug))
    .map((entry) => ({ label: entry.name, slug: entry.slug as string }));

  return [
    { label: "All products", slug: null },
    ...SHOP_CATEGORIES.map((entry) => ({ label: entry.label, slug: entry.slug })),
    ...extras,
  ].map((entry) => ({
    label: entry.label,
    href: entry.slug ? `/category/${entry.slug}` : "/all-products",
    active: entry.slug === categorySlug,
  }));
});

async function fetchPage() {
  if (usingInitialData) {
    fetched = null;
    return;
  }

  const seq = ++requestSeq;
  isLoading = true;
  try {
    const filter = buildFilter({}, categoryName);
    const { data, error } = await getSdk().catalog.searchProducts({
      query: "",
      page,
      limit: PAGE_SIZE,
      ...(filter.length > 0 ? { filter } : {}),
      ...(sort ? { sort: [sort] } : {}),
    });
    if (error) throw new Error(error.message);
    if (seq !== requestSeq) return;
    fetched = { skus: data?.skus ?? [], pagination: data?.pagination };
  } catch (error) {
    if (seq !== requestSeq) return;
    // biome-ignore lint/suspicious/noConsole: surface catalog failures
    console.error("Failed to load products:", error);
    fetched = { skus: [] };
  } finally {
    if (seq === requestSeq) isLoading = false;
  }
}

// The React ports get this from a query that runs whenever initial data is
// unavailable; here the request has to be started explicitly, or a failed loader
// read would leave the grid permanently empty with no way to recover.
$effect(() => {
  if (usingInitialData || fetched !== null || requested) return;
  requested = true;
  void fetchPage();
});

function changeSort(next: string) {
  sort = next;
  page = 1;
  void fetchPage();
}

function changePage(next: number) {
  page = next;
  window.scrollTo({ top: 0, behavior: "smooth" });
  void fetchPage();
}
</script>

<main>
	<PlpHero
		title={categoryName ?? PLP_COPY.title}
		subtitle={categoryDescription || PLP_COPY.subtitle}
	/>
	<CategoryFilterRow items={filterItems} />
	<SortSelect value={sort} onchange={changeSort} count={pagination?.total_records} />
	<ProductGrid
		{skus}
		{isLoading}
		{pagination}
		onpagechange={changePage}
		emptyMessage="Nothing in this collection yet."
	/>
	<BrandPillars />
</main>
