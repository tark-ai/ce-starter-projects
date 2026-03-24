<script lang="ts">
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import ProductGrid from "$lib/components/ProductGrid.svelte";
import { getSdk } from "$lib/storefront";

let { data } = $props();

let clientSkus = $state<Item[] | null>(null);
let clientPagination = $state<PaginationType | undefined>(undefined);
let isLoading = $state(false);

const displaySkus = $derived(clientSkus ?? data.skus);
const displayPagination = $derived(clientPagination ?? data.pagination);

$effect(() => {
  void data.query;
  clientSkus = null;
  clientPagination = undefined;
});

async function handlePageChange(page: number) {
  if (!data.query) return;
  isLoading = true;
  try {
    const sdk = getSdk();
    const { data: result } = await sdk.catalog.searchProducts({
      query: data.query,
      page,
      limit: 20,
      facets: ["*"],
    });
    clientSkus = result?.skus ?? [];
    clientPagination = result?.pagination;
  } finally {
    isLoading = false;
  }
}
</script>

<div class="pt-6 px-6">
	<div class="mb-8">
		<h1 class="text-3xl font-light text-foreground">
			{#if data.query}
				Search results for "{data.query}"
			{:else}
				Search
			{/if}
		</h1>
		{#if data.query && displaySkus.length === 0 && !isLoading}
			<p class="text-muted-foreground mt-4">
				No results found for "{data.query}". Try a different search term.
			</p>
		{/if}
	</div>

	{#if displaySkus.length > 0}
		<ProductGrid
			skus={displaySkus}
			{isLoading}
			pagination={displayPagination}
			onpagechange={handlePageChange}
		/>
	{/if}
</div>
