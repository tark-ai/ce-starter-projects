<script lang="ts">
import { formatPrice } from "@ce/soja-ui/lib/format";
import type { Variant, VariantOption } from "@commercengine/storefront";
import { checkout } from "$lib/checkout.svelte";
import { getProductTags, type SojaProductDetail, splitDescription } from "$lib/product-meta";
import { cn } from "$lib/utils";
import { getOptionSelectionValue, getVariantOption } from "$lib/variants";
import { wishlist } from "$lib/wishlist.svelte";
import WishlistButton from "../WishlistButton.svelte";
import QuantityStepper from "./QuantityStepper.svelte";

interface Props {
  product: SojaProductDetail;
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  allOptionsSelected: boolean;
  onoptionchange: (optionKey: string, optionValue: string) => void;
  tagLimit?: number;
}

let {
  product,
  selectedVariantId,
  selectedOptions,
  allOptionsSelected,
  onoptionchange,
  tagLimit = 6,
}: Props = $props();

let adding = $state(false);
let quantity = $state(1);

/** Backorder counts as purchasable: it sells now and ships when restocked. */
function isPurchasableStock(entity: { stock_available: boolean; backorder?: boolean }): boolean {
  return entity.stock_available || Boolean(entity.backorder);
}

function isColorValue(value: unknown): value is { name: string; hexcode: string } {
  if (typeof value !== "object" || value === null) return false;
  const maybe = value as { name?: unknown; hexcode?: unknown };
  return typeof maybe.name === "string" && typeof maybe.hexcode === "string";
}

function optionValues(option: VariantOption) {
  const values: Array<{ selectionValue: string; label: string; hexcode?: string }> = [];
  const seen = new Set<string>();

  if (option.type === "color") {
    for (const raw of option.value) {
      if (!isColorValue(raw) || seen.has(raw.name)) continue;
      seen.add(raw.name);
      values.push({ selectionValue: raw.name, label: raw.name, hexcode: raw.hexcode });
    }
    return values;
  }

  for (const raw of option.value) {
    if (typeof raw !== "string" || seen.has(raw)) continue;
    seen.add(raw);
    values.push({ selectionValue: raw, label: raw });
  }
  return values;
}

const variants = $derived(product.variants ?? []);
const selectedVariant = $derived(
  product.has_variant ? (variants.find((v) => v.id === selectedVariantId) ?? null) : null
);

const optionGroups = $derived.by(() => {
  const variantOptions = product.has_variant ? (product.variant_options ?? []) : [];
  if (variantOptions.length === 0) return [];

  const baseSelection: Record<string, string> = {};
  for (const option of variantOptions) {
    const value = selectedOptions[option.key];
    if (value) baseSelection[option.key] = value;
  }

  const matches = (variant: Variant, selection: Record<string, string>) =>
    Object.entries(selection).every(([key, expected]) => {
      const option = getVariantOption(variant, key);
      return option ? getOptionSelectionValue(option) === expected : false;
    });

  return variantOptions.map((option) => ({
    option,
    values: optionValues(option).map((value) => ({
      ...value,
      isPurchasable: variants.some(
        (variant) =>
          matches(variant, { ...baseSelection, [option.key]: value.selectionValue }) &&
          isPurchasableStock(variant)
      ),
    })),
  }));
});

const price = $derived(selectedVariant?.pricing?.selling_price ?? product.pricing.selling_price);
const currency = $derived(selectedVariant?.pricing?.currency ?? product.pricing.currency);
const compareAt = $derived(selectedVariant?.pricing?.listing_price ?? product.pricing.listing_price);
const onSale = $derived(typeof compareAt === "number" && compareAt > price);

const stockSource = $derived(product.has_variant ? selectedVariant : product);
const hasCompleteSelection = $derived(
  !product.has_variant || (allOptionsSelected && Boolean(selectedVariant))
);
const inStock = $derived(stockSource ? isPurchasableStock(stockSource) : false);
const isBackorder = $derived(
  Boolean(stockSource && !stockSource.stock_available && stockSource.backorder)
);
const canAddToCart = $derived(hasCompleteSelection && inStock && !adding);

const tagline = $derived(
  selectedVariant?.short_description ||
    product.short_description ||
    splitDescription(product.description).lede
);
const tags = $derived(getProductTags(product.tags, tagLimit));
const sku = $derived(selectedVariant?.sku ?? product.sku);
const wishlisted = $derived(wishlist.isInWishlist(product.id, selectedVariantId));

const ctaLabel = $derived(
  !hasCompleteSelection
    ? "Select an option"
    : !inStock
      ? "Out of stock"
      : adding
        ? "Adding…"
        : "Add to Cart"
);

function addToCart() {
  if (!canAddToCart) return;
  adding = true;
  try {
    checkout.addToCart(product.id, selectedVariantId, quantity);
  } finally {
    // The checkout bridge is fire-and-forget, so release on the next tick: long
    // enough to swallow a double click, without pretending to track completion.
    setTimeout(() => {
      adding = false;
    }, 600);
  }
}
</script>

<div class="flex flex-col gap-10">
	<div class="flex flex-col gap-5">
		<h1 class="font-display text-[2rem] tracking-display tablet:text-display">{product.name}</h1>

		{#if selectedVariant && selectedVariant.name !== product.name}
			<p class="text-meta text-muted-foreground">{selectedVariant.name}</p>
		{/if}

		{#if tagline}
			<p class="max-w-[460px] text-meta leading-relaxed whitespace-pre-line text-foreground/75">
				{tagline}
			</p>
		{/if}

		<div class="flex items-baseline gap-3">
			<p class="font-display text-title tracking-display">{formatPrice(price, currency)}</p>
			{#if onSale}
				<p class="text-meta text-muted-foreground line-through">
					{formatPrice(compareAt, currency)}
				</p>
			{/if}
		</div>
	</div>

	{#if tags.length > 0}
		<div class="flex flex-wrap gap-x-6 gap-y-2 text-meta text-muted-foreground">
			{#each tags as tag (tag)}
				<span class="capitalize">{tag}</span>
			{/each}
		</div>
	{/if}

	{#each optionGroups as group (group.option.key)}
		<fieldset class="flex flex-col gap-4">
			<legend class="text-meta text-muted-foreground">
				Select {group.option.name || group.option.key}
			</legend>
			<div class="flex flex-wrap gap-2">
				{#each group.values as value (value.selectionValue)}
					<button
						type="button"
						onclick={() => onoptionchange(group.option.key, value.selectionValue)}
						disabled={!value.isPurchasable}
						aria-pressed={selectedOptions[group.option.key] === value.selectionValue}
						class={cn(
							"flex h-11 items-center gap-2 border px-5 text-meta transition-colors duration-300 ease-soja",
							selectedOptions[group.option.key] === value.selectionValue
								? "border-foreground bg-foreground text-background"
								: "border-border hover:border-foreground",
							!value.isPurchasable &&
								"pointer-events-none text-muted-foreground line-through opacity-40"
						)}
					>
						{#if value.hexcode}
							<span
								aria-hidden="true"
								class="h-3 w-3 border border-black/10"
								style={`background-color:${value.hexcode}`}
							></span>
						{/if}
						{value.label}
					</button>
				{/each}
			</div>
		</fieldset>
	{/each}

	<div class="flex flex-col gap-5">
		{#if hasCompleteSelection || sku}
			<p class="flex flex-wrap gap-x-3 text-meta text-muted-foreground">
				{#if hasCompleteSelection}
					<span>{inStock ? (isBackorder ? "Made to order" : "In stock") : "Out of stock"}</span>
				{/if}
				{#if sku}
					<span>SKU {sku}</span>
				{/if}
			</p>
		{/if}

		<div class="flex flex-wrap items-center gap-3">
			<QuantityStepper value={quantity} onchange={(next) => (quantity = next)} />
			<button
				type="button"
				onclick={addToCart}
				disabled={!canAddToCart}
				class="h-12 flex-1 min-w-[200px] bg-primary px-8 text-meta text-primary-foreground transition-colors duration-300 ease-soja hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-40"
			>
				{ctaLabel}
			</button>
			<WishlistButton
				active={wishlisted}
				onclick={() => wishlist.toggleWishlist(product.id, selectedVariantId)}
				variant="control"
			/>
		</div>
	</div>
</div>
