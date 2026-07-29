<script lang="ts">
import type { Pagination as PaginationType } from "@commercengine/storefront";
import { ChevronLeft, ChevronRight } from "lucide-svelte";

interface Props {
  pagination: PaginationType;
  onpagechange: (page: number) => void;
}

let { pagination, onpagechange }: Props = $props();

const currentPage = $derived(
  pagination.next_page ? pagination.next_page - 1 : pagination.total_pages
);

function getPageNumbers(
  totalPages: number,
  current: number
): (number | { type: "ellipsis"; id: string })[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | { type: "ellipsis"; id: string })[] = [1];
  if (current > 3) pages.push({ type: "ellipsis", id: "start" });

  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < totalPages - 2) pages.push({ type: "ellipsis", id: "end" });
  pages.push(totalPages);
  return pages;
}

const pages = $derived(getPageNumbers(pagination.total_pages, currentPage));
</script>

<section class="mx-auto w-full max-w-[1400px] px-6 py-8 lg:px-20">
	<div class="flex items-center justify-center gap-2">
		<button
			type="button"
			class="grid size-9 place-items-center rounded-md border border-border p-2 transition-colors hover:bg-secondary disabled:opacity-30"
			disabled={!pagination.previous_page}
			onclick={() => pagination.previous_page && onpagechange(pagination.previous_page)}
			aria-label="Previous page"
		>
			<ChevronLeft class="h-4 w-4" />
		</button>

		<div class="flex items-center gap-1">
			{#each pages as page (typeof page === 'object' ? `ellipsis-${page.id}` : page)}
				{#if typeof page === 'object'}
					<span class="mx-2 text-sm font-light text-muted-foreground">...</span>
				{:else}
					<button
						type="button"
						class="h-9 min-w-9 rounded-md px-2 text-sm transition-colors {page === currentPage
							? 'bg-primary text-primary-foreground'
							: 'hover:bg-secondary'}"
						onclick={() => onpagechange(page)}
					>
						{page}
					</button>
				{/if}
			{/each}
		</div>

		<button
			type="button"
			class="grid size-9 place-items-center rounded-md border border-border p-2 transition-colors hover:bg-secondary disabled:opacity-30"
			disabled={!pagination.next_page}
			onclick={() => pagination.next_page && onpagechange(pagination.next_page)}
			aria-label="Next page"
		>
			<ChevronRight class="h-4 w-4" />
		</button>
	</div>
</section>
