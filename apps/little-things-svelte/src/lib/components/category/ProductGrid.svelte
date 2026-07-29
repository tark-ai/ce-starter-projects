<script lang="ts">
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import ProductCard from "../ProductCard.svelte";
import Pagination from "./Pagination.svelte";

interface Props {
  skus: Item[];
  isLoading?: boolean;
  pagination?: PaginationType;
  onpagechange: (page: number) => void;
}

let { skus, isLoading = false, pagination, onpagechange }: Props = $props();

const skeletonIds = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
</script>

{#if isLoading}
	<section class="mx-auto mb-16 w-full max-w-[1400px] px-6 lg:px-20">
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
			{#each skeletonIds as id (id)}
				<div>
					<div class="mb-3 aspect-[4/3] animate-pulse rounded-lg bg-muted"></div>
					<div class="mb-1 h-4 w-20 animate-pulse bg-muted"></div>
					<div class="h-4 w-32 animate-pulse bg-muted"></div>
				</div>
			{/each}
		</div>
	</section>
{:else if skus.length === 0}
	<section class="mx-auto mb-16 w-full max-w-[1400px] px-6 lg:px-20">
		<p class="py-12 text-center text-sm font-light text-muted-foreground">
			Nothing here yet. Even our search came up empty — try something else?
		</p>
	</section>
{:else}
	<section class="mx-auto mb-16 w-full max-w-[1400px] px-6 lg:px-20">
		<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
			{#each skus as item (item.sku)}
				<ProductCard {item} />
			{/each}
		</div>

		{#if pagination && pagination.total_pages > 1}
			<Pagination {pagination} {onpagechange} />
		{/if}
	</section>
{/if}
