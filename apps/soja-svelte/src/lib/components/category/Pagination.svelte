<script lang="ts">
import type { Pagination as PaginationType } from "@commercengine/storefront";

interface Props {
  pagination: PaginationType;
  onpagechange: (page: number) => void;
}

let { pagination, onpagechange }: Props = $props();

// The API reports neighbours, not the current page.
const total = $derived(pagination.total_pages ?? 1);
const current = $derived(pagination.next_page ? pagination.next_page - 1 : total);
</script>

{#if total > 1}
	<nav aria-label="Pagination" class="soja-container flex items-center justify-between gap-6 py-16">
		<button
			type="button"
			disabled={current <= 1}
			onclick={() => onpagechange(current - 1)}
			class="text-meta transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
		>
			Previous
		</button>
		<span class="text-meta text-muted-foreground" aria-live="polite">{current} / {total}</span>
		<button
			type="button"
			disabled={current >= total}
			onclick={() => onpagechange(current + 1)}
			class="text-meta transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
		>
			Next
		</button>
	</nav>
{/if}
