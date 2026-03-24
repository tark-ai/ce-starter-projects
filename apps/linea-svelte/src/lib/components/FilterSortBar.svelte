<script lang="ts">
import { formatPrice } from "@ce/ui/lib/format";

let {
  itemCount,
  currency,
  baseFacetDistribution,
  baseFacetStats,
  facetDistribution,
  filters,
  onfilterschange,
}: {
  itemCount: number;
  currency: string;
  baseFacetDistribution: Record<string, Record<string, number>>;
  baseFacetStats: Record<string, { min: number; max: number }>;
  facetDistribution: Record<string, Record<string, number>>;
  filters: Record<string, unknown>;
  onfilterschange: (filters: Record<string, unknown>) => void;
} = $props();

let filtersOpen = $state(false);
let localPriceMin = $state<number | null>(null);
let localPriceMax = $state<number | null>(null);

const priceStats = $derived(baseFacetStats["pricing.selling_price"]);

const hasActiveFilters = $derived(Object.keys(filters).length > 0);

const priceFilter = $derived(filters.price_range as { min: number; max: number } | undefined);

const priceRangeMin = $derived(localPriceMin ?? priceFilter?.min ?? priceStats?.min ?? 0);
const priceRangeMax = $derived(localPriceMax ?? priceFilter?.max ?? priceStats?.max ?? 0);

const FILTER_LABELS: Record<string, string> = {
  "categories.name": "Category",
  "attribute.metal": "Metal",
  "attribute.material": "Material",
};

const RATING_OPTIONS = [4, 3, 2, 1] as const;

const CHECKBOX_FACET_KEYS = ["categories.name", "attribute.metal", "attribute.material"] as const;

const checkboxFacets = $derived(
  CHECKBOX_FACET_KEYS.filter((key) => {
    const values = baseFacetDistribution[key];
    return values && Object.keys(values).length > 0;
  })
);

const minRating = $derived(filters.min_rating as number | undefined);

function isChecked(facetKey: string, value: string): boolean {
  const current = filters[facetKey];
  if (!Array.isArray(current)) return false;
  return current.includes(value);
}

function toggleFilter(facetKey: string, value: string) {
  const current = (filters[facetKey] as string[]) || [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

  const updated = { ...filters };
  if (next.length === 0) {
    delete updated[facetKey];
  } else {
    updated[facetKey] = next;
  }
  onfilterschange(updated);
}

function handlePriceMinInput(value: number) {
  localPriceMin = Math.min(value, priceRangeMax);
}

function handlePriceMaxInput(value: number) {
  localPriceMax = Math.max(value, priceRangeMin);
}

function commitPriceRange() {
  const updated = { ...filters };
  const effectiveMin = priceRangeMin;
  const effectiveMax = priceRangeMax;
  if (priceStats && effectiveMin === priceStats.min && effectiveMax === priceStats.max) {
    delete updated.price_range;
  } else {
    updated.price_range = { min: effectiveMin, max: effectiveMax };
  }
  localPriceMin = null;
  localPriceMax = null;
  onfilterschange(updated);
}

function setMinRating(rating: number) {
  const updated = { ...filters };
  if (minRating === rating) {
    delete updated.min_rating;
  } else {
    updated.min_rating = rating;
  }
  onfilterschange(updated);
}

function clearAll() {
  onfilterschange({});
}
</script>

<section class="w-full px-6 mb-8 border-b border-border pb-4">
	<div class="flex justify-between items-center">
		<p class="text-sm font-light text-muted-foreground">{itemCount} items</p>

		<div class="flex items-center gap-4">
			<button
				type="button"
				class="text-sm font-light hover:bg-transparent px-3 py-1.5"
				onclick={() => (filtersOpen = true)}
			>
				Filters{hasActiveFilters ? ' *' : ''}
			</button>
		</div>
	</div>
</section>

{#if filtersOpen}
	<div class="fixed inset-0 z-50">
		<button
			class="absolute inset-0 bg-black/50"
			onclick={() => (filtersOpen = false)}
			aria-label="Close filters"
		></button>
		<div
			class="absolute right-0 top-0 h-full w-80 bg-background border-l border-border overflow-y-auto animate-in slide-in-from-right duration-300"
		>
			<!-- Header -->
			<div class="border-b border-border p-6 pb-4">
				<div class="flex items-center justify-between">
					<h2 class="text-lg font-light">Filters</h2>
					<div class="flex items-center gap-2">
						{#if hasActiveFilters}
							<button
								type="button"
								class="text-sm font-light hover:underline"
								onclick={clearAll}
							>
								Clear All
							</button>
						{/if}
						<button
							type="button"
							class="text-sm font-light hover:opacity-50"
							onclick={() => (filtersOpen = false)}
							aria-label="Close filters"
						>
							&times;
						</button>
					</div>
				</div>
			</div>

			<!-- Filter content -->
			<div class="space-y-8 p-6">
				<!-- Price Range (dual-thumb) -->
				{#if priceStats && priceStats.min < priceStats.max}
					<div>
						<h3 class="text-sm font-light mb-4 text-foreground">Price</h3>
						<div class="relative h-5 mb-3">
							<!-- Track background -->
							<div class="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-border rounded"></div>
							<!-- Active range highlight -->
							<div
								class="absolute top-1/2 -translate-y-1/2 h-0.5 bg-foreground rounded"
								style="left: {((priceRangeMin - priceStats.min) / (priceStats.max - priceStats.min)) * 100}%; right: {((priceStats.max - priceRangeMax) / (priceStats.max - priceStats.min)) * 100}%"
							></div>
							<!-- Min thumb -->
							<input
								type="range"
								min={priceStats.min}
								max={priceStats.max}
								step={1000}
								value={priceRangeMin}
								oninput={(e) => handlePriceMinInput(Number(e.currentTarget.value))}
								onchange={commitPriceRange}
								class="dual-range-thumb"
							/>
							<!-- Max thumb -->
							<input
								type="range"
								min={priceStats.min}
								max={priceStats.max}
								step={1000}
								value={priceRangeMax}
								oninput={(e) => handlePriceMaxInput(Number(e.currentTarget.value))}
								onchange={commitPriceRange}
								class="dual-range-thumb"
							/>
						</div>
						<div class="flex justify-between text-xs font-light text-muted-foreground">
							<span>{formatPrice(priceRangeMin, currency)}</span>
							<span>{formatPrice(priceRangeMax, currency)}</span>
						</div>
					</div>
				{/if}

				<!-- Checkbox Facets -->
				{#each checkboxFacets as facetKey, idx (facetKey)}
					{@const baseValues = baseFacetDistribution[facetKey]}
					{@const liveValues = facetDistribution[facetKey] ?? {}}
					{@const showSeparator =
						idx > 0 || (priceStats != null && priceStats.min < priceStats.max)}

					<div>
						{#if showSeparator}
							<div class="border-t border-border mb-8"></div>
						{/if}
						<h3 class="text-sm font-light mb-4 text-foreground">
							{FILTER_LABELS[facetKey] ?? facetKey}
						</h3>
						<div class="space-y-3">
							{#each Object.entries(baseValues) as [value] (value)}
								{@const count = liveValues[value] ?? 0}
								{@const disabled = count === 0 && !isChecked(facetKey, value)}
								{@const checkboxId = `${facetKey}-${value}`}

								<div class="flex items-center space-x-3">
									<input
										type="checkbox"
										id={checkboxId}
										checked={isChecked(facetKey, value)}
										onchange={() => toggleFilter(facetKey, value)}
										{disabled}
										class="h-4 w-4 rounded border-border accent-foreground"
									/>
									<label
										for={checkboxId}
										class="text-sm font-light cursor-pointer {disabled
											? 'text-muted-foreground/50'
											: 'text-foreground'}"
									>
										{value} ({count})
									</label>
								</div>
							{/each}
						</div>
					</div>
				{/each}

				<!-- Rating Filter -->
				{#if baseFacetDistribution.rating}
					<div>
						<div class="border-t border-border mb-8"></div>
						<h3 class="text-sm font-light mb-4 text-foreground">Rating</h3>
						<div class="space-y-3">
							{#each RATING_OPTIONS as rating (rating)}
								{@const liveRatings = facetDistribution.rating ?? {}}
								{@const count = Object.entries(liveRatings).reduce(
									(sum, [r, c]) => (Number(r) >= rating ? sum + c : sum),
									0
								)}

								<button
									type="button"
									onclick={() => setMinRating(rating)}
									class="flex items-center gap-2 text-sm font-light {minRating === rating
										? 'text-foreground'
										: 'text-muted-foreground'}"
								>
									<span
										class={minRating === rating
											? 'text-amber-500'
											: 'text-muted-foreground/50'}
									>
										{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
									</span>
									<span>& up ({count})</span>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.dual-range-thumb {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		pointer-events: none;
		margin: 0;
	}

	.dual-range-thumb::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: hsl(var(--foreground));
		border: 2px solid hsl(var(--background));
		cursor: pointer;
		pointer-events: all;
		box-shadow: 0 0 0 1px hsl(var(--border));
	}

	.dual-range-thumb::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: hsl(var(--foreground));
		border: 2px solid hsl(var(--background));
		cursor: pointer;
		pointer-events: all;
		box-shadow: 0 0 0 1px hsl(var(--border));
	}
</style>
