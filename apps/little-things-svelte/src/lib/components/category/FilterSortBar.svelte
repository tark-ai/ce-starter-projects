<script lang="ts">
import { formatPrice } from "@ce/little-things-ui/lib/format";
import { SlidersHorizontal, X } from "lucide-svelte";

interface FacetDistribution {
  [key: string]: { [value: string]: number };
}
interface FacetStats {
  [key: string]: { min: number; max: number };
}

interface Props {
  itemCount: number;
  currency: string;
  baseFacetDistribution: FacetDistribution;
  baseFacetStats: FacetStats;
  facetDistribution: FacetDistribution;
  filters: Record<string, unknown>;
  onfilterschange: (filters: Record<string, unknown>) => void;
}

let {
  itemCount,
  currency,
  baseFacetDistribution,
  baseFacetStats,
  facetDistribution,
  filters,
  onfilterschange,
}: Props = $props();

const FILTER_LABELS: Record<string, string> = {
  "categories.name": "Category",
  "attribute.metal": "Metal",
  "attribute.material": "Material",
};

let isOpen = $state(false);

const hasActiveFilters = $derived(Object.keys(filters).length > 0);
const priceStats = $derived(baseFacetStats["pricing.selling_price"]);
const priceFilter = $derived(filters.price_range as { min: number; max: number } | undefined);

const checkboxFacets = $derived(
  (["categories.name", "attribute.metal", "attribute.material"] as const).filter((key) => {
    const values = baseFacetDistribution[key];
    return values && Object.keys(values).length > 0;
  })
);

function isChecked(facetKey: string, value: string): boolean {
  const current = filters[facetKey];
  return Array.isArray(current) && current.includes(value);
}

function toggleFilter(facetKey: string, value: string) {
  const current = (filters[facetKey] as string[]) || [];
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];

  const updated = { ...filters };
  if (next.length === 0) {
    delete updated[facetKey];
  } else {
    updated[facetKey] = next;
  }
  onfilterschange(updated);
}

function applyPrice(min: number, max: number) {
  const updated = { ...filters };
  if (priceStats && min === priceStats.min && max === priceStats.max) {
    delete updated.price_range;
  } else {
    updated.price_range = { min, max };
  }
  onfilterschange(updated);
}
</script>

<section
	class="mx-auto mb-8 flex w-full max-w-[1400px] items-center justify-between border-b border-border px-6 pb-4 lg:px-20"
>
	<p class="text-sm font-light text-muted-foreground">{itemCount} items</p>

	<button
		type="button"
		class="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
		onclick={() => (isOpen = true)}
	>
		<SlidersHorizontal class="h-4 w-4" />
		Filters{hasActiveFilters ? ' *' : ''}
	</button>
</section>

{#if isOpen}
	<div class="fixed inset-0 z-50">
		<button
			type="button"
			class="absolute inset-0 cursor-pointer border-0 bg-black/50 p-0"
			onclick={() => (isOpen = false)}
			aria-label="Close filters"
		></button>

		<div
			class="absolute right-0 top-0 flex h-screen w-80 max-w-full flex-col border-l border-border bg-background animate-slide-in-right"
		>
			<div class="flex items-center justify-between border-b border-border p-6">
				<h2 class="text-lg font-bold text-foreground">Filters</h2>
				<div class="flex items-center gap-2">
					{#if hasActiveFilters}
						<button
							type="button"
							class="text-sm font-light text-muted-foreground hover:underline"
							onclick={() => onfilterschange({})}
						>
							Clear all
						</button>
					{/if}
					<button
						type="button"
						onclick={() => (isOpen = false)}
						class="p-1 text-foreground hover:text-muted-foreground"
						aria-label="Close"
					>
						<X size={20} />
					</button>
				</div>
			</div>

			<div class="flex-1 space-y-8 overflow-y-auto p-6">
				{#if priceStats && priceStats.min < priceStats.max}
					{@const lo = priceFilter?.min ?? priceStats.min}
					{@const hi = priceFilter?.max ?? priceStats.max}
					<div>
						<h3 class="mb-4 text-sm font-medium text-foreground">Price</h3>
						<div class="flex items-center gap-3">
							<input
								type="number"
								min={priceStats.min}
								max={priceStats.max}
								value={lo}
								class="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
								onchange={(e) => applyPrice(Number(e.currentTarget.value), hi)}
								aria-label="Minimum price"
							/>
							<span class="text-muted-foreground">–</span>
							<input
								type="number"
								min={priceStats.min}
								max={priceStats.max}
								value={hi}
								class="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
								onchange={(e) => applyPrice(lo, Number(e.currentTarget.value))}
								aria-label="Maximum price"
							/>
						</div>
						<div class="mt-2 flex justify-between text-xs font-light text-muted-foreground">
							<span>{formatPrice(lo, currency)}</span>
							<span>{formatPrice(hi, currency)}</span>
						</div>
					</div>
				{/if}

				{#each checkboxFacets as facetKey (facetKey)}
					{@const baseValues = baseFacetDistribution[facetKey]}
					{@const liveValues = facetDistribution[facetKey] ?? {}}
					<div class="border-t border-border pt-6 first:border-t-0 first:pt-0">
						<h3 class="mb-4 text-sm font-medium text-foreground">
							{FILTER_LABELS[facetKey] ?? facetKey}
						</h3>
						<div class="space-y-3">
							{#each Object.keys(baseValues) as value (value)}
								{@const count = liveValues[value] ?? 0}
								{@const disabled = count === 0 && !isChecked(facetKey, value)}
								<label
									class="flex items-center gap-3 text-sm font-light {disabled
										? 'text-muted-foreground/50'
										: 'text-foreground'}"
								>
									<input
										type="checkbox"
										checked={isChecked(facetKey, value)}
										{disabled}
										onchange={() => toggleFilter(facetKey, value)}
										class="size-4 rounded border-input"
									/>
									<span class="cursor-pointer">{value} ({count})</span>
								</label>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
