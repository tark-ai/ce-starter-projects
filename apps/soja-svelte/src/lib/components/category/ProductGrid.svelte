<script lang="ts">
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import ProductCard from "../ProductCard.svelte";
import ProductCardSkeleton from "../ProductCardSkeleton.svelte";
import Reveal from "../Reveal.svelte";
import Pagination from "./Pagination.svelte";

interface Props {
  skus: Item[];
  isLoading?: boolean;
  pagination?: PaginationType;
  onpagechange?: (page: number) => void;
  emptyMessage?: string;
}

let {
  skus,
  isLoading = false,
  pagination,
  onpagechange,
  emptyMessage = "Nothing here yet. Try another category.",
}: Props = $props();
</script>

{#if isLoading && skus.length === 0}
	<div class="grid w-full grid-cols-2 gap-3 px-3 tablet:grid-cols-3">
		{#each Array.from({ length: 6 }, (_, index) => index) as index (index)}
			<ProductCardSkeleton />
		{/each}
	</div>
{:else if skus.length === 0}
	<div class="soja-container py-24">
		<p class="font-display text-title tracking-display text-muted-foreground">{emptyMessage}</p>
	</div>
{:else}
	<div class="grid w-full grid-cols-2 gap-3 px-3 tablet:grid-cols-3">
		{#each skus as item, index (`${item.product_id}-${item.variant_id ?? index}`)}
			<Reveal delay={(index % 3) * 90}>
				<ProductCard {item} />
			</Reveal>
		{/each}
	</div>
	{#if pagination && onpagechange}
		<Pagination {pagination} {onpagechange} />
	{/if}
{/if}
