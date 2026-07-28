<script lang="ts">
import { formatPrice } from "@ce/little-things-ui/lib/format";
import type { Product, VariantOption } from "@commercengine/storefront";
import { Heart } from "lucide-svelte";
import { checkout } from "$lib/checkout.svelte";
import { getOptionSelectionValue, getVariantOption } from "$lib/variants";
import { wishlist } from "$lib/wishlist.svelte";

interface Props {
  product: Product;
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  allOptionsSelected: boolean;
  onoptionchange: (optionKey: string, optionValue: string) => void;
}

let { product, selectedVariantId, selectedOptions, allOptionsSelected, onoptionchange }: Props =
  $props();

let adding = $state(false);

const selectedVariant = $derived(
  product.has_variant ? product.variants.find((v) => v.id === selectedVariantId) : null
);

const displayPrice = $derived(
  selectedVariant?.pricing?.selling_price ?? product.pricing.selling_price
);
const displayCurrency = $derived(selectedVariant?.pricing?.currency ?? product.pricing.currency);

const wishlisted = $derived(wishlist.isInWishlist(product.id, selectedVariantId));

const hasCompleteVariantSelection = $derived(
  !product.has_variant || (allOptionsSelected && !!selectedVariant)
);

const isPurchasable = $derived(
  product.has_variant
    ? selectedVariant
      ? selectedVariant.stock_available || Boolean(selectedVariant.backorder)
      : false
    : product.stock_available || Boolean(product.backorder)
);

const canAddToCart = $derived(hasCompleteVariantSelection && isPurchasable && !adding);

const tagRow = $derived(
  Array.from(
    new Set([
      ...(product.categories?.map((c) => c.name) ?? []),
      ...((product.tags ?? []) as string[]),
    ])
  ).slice(0, 4)
);

const description = $derived(product.short_description || "");

type OptionValueInfo = {
  selectionValue: string;
  label: string;
  hexcode?: string;
  isPurchasable: boolean;
};
type OptionGroup = { option: VariantOption; values: OptionValueInfo[] };

function isColorVariantOptionValue(value: unknown): value is { name: string; hexcode: string } {
  if (typeof value !== "object" || value === null) return false;
  const maybeColor = value as { name?: unknown; hexcode?: unknown };
  return typeof maybeColor.name === "string" && typeof maybeColor.hexcode === "string";
}

function getVariantOptionValues(
  option: VariantOption
): Array<{ selectionValue: string; label: string; hexcode?: string }> {
  const values: Array<{ selectionValue: string; label: string; hexcode?: string }> = [];
  const seen = new Set<string>();

  if (option.type === "color") {
    for (const rawValue of option.value) {
      if (!isColorVariantOptionValue(rawValue)) continue;
      if (seen.has(rawValue.name)) continue;
      seen.add(rawValue.name);
      values.push({ selectionValue: rawValue.name, label: rawValue.name, hexcode: rawValue.hexcode });
    }
    return values;
  }

  for (const rawValue of option.value) {
    if (typeof rawValue !== "string") continue;
    if (seen.has(rawValue)) continue;
    seen.add(rawValue);
    values.push({ selectionValue: rawValue, label: rawValue });
  }
  return values;
}

function isVariantPurchasable(variant: Product["variants"][number]): boolean {
  return variant.stock_available || Boolean(variant.backorder);
}

const optionGroups: OptionGroup[] = $derived.by(() => {
  if (!product.has_variant || !product.variant_options) return [];

  const optionKeys = product.variant_options.map((option) => option.key);
  const baseSelection = optionKeys.reduce<Record<string, string>>((acc, key) => {
    const value = selectedOptions[key];
    if (value) acc[key] = value;
    return acc;
  }, {});

  function matchesSelection(
    variant: Product["variants"][number],
    selection: Record<string, string>
  ): boolean {
    return Object.entries(selection).every(([key, expectedValue]) => {
      const option = getVariantOption(variant, key);
      return option ? getOptionSelectionValue(option) === expectedValue : false;
    });
  }

  return product.variant_options.map((option) => ({
    option,
    values: getVariantOptionValues(option).map((optionValue) => {
      const candidate = { ...baseSelection, [option.key]: optionValue.selectionValue };
      const purchasable = product.variants.some(
        (variant) => matchesSelection(variant, candidate) && isVariantPurchasable(variant)
      );
      return { ...optionValue, isPurchasable: purchasable };
    }),
  }));
});

async function handleAddToCart() {
  if (product.has_variant && !selectedVariantId) return;
  adding = true;
  try {
    await checkout.addToCart(product.id, selectedVariantId, 1);
  } finally {
    adding = false;
  }
}
</script>

<div class="space-y-6">
	<!-- Title + price -->
	<div class="flex items-start justify-between gap-6">
		<h1 class="font-display text-4xl italic leading-tight text-foreground md:text-5xl">
			{product.name}
		</h1>
		<p class="shrink-0 font-display text-3xl italic text-brand md:text-4xl">
			{formatPrice(displayPrice, displayCurrency)}
		</p>
	</div>

	{#if description}
		<p class="text-base leading-relaxed text-muted-foreground">{description}</p>
	{/if}

	{#if tagRow.length > 0}
		<div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
			{#each tagRow as tag (tag)}
				<span class="capitalize">{tag}</span>
			{/each}
		</div>
	{/if}

	<!-- Variant option selectors -->
	{#if product.has_variant && optionGroups.length > 0}
		<div class="space-y-5 pt-2">
			{#each optionGroups as { option, values } (option.key)}
				{@const isColor = option.type === 'color'}
				{@const selectedValue = selectedOptions[option.key]}
				<div class="space-y-2">
					<div class="flex items-center gap-2 text-sm">
						<span class="font-medium capitalize text-foreground">{option.name}</span>
						{#if selectedValue}
							<span class="capitalize text-muted-foreground">{selectedValue}</span>
						{/if}
					</div>
					<div class="flex flex-wrap gap-2.5">
						{#each values as { selectionValue, label, hexcode, isPurchasable: purchasable } (`${option.key}-${selectionValue}`)}
							{@const isSelected = selectedValue === selectionValue}
							{#if isColor}
								<button
									type="button"
									onclick={() => onoptionchange(option.key, selectionValue)}
									disabled={!purchasable}
									title={label}
									aria-pressed={isSelected}
									class="grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-background transition-all {isSelected
										? 'ring-2 ring-foreground'
										: 'ring-1 ring-border hover:ring-foreground/40'} {!purchasable
										? 'cursor-not-allowed opacity-40'
										: ''}"
								>
									<span
										class="block size-7 rounded-full border border-black/10"
										style:background-color={hexcode}
									></span>
								</button>
							{:else}
								<button
									type="button"
									onclick={() => onoptionchange(option.key, selectionValue)}
									disabled={!purchasable}
									aria-pressed={isSelected}
									class="rounded-full border px-4 py-2 text-sm transition-colors {isSelected
										? 'border-foreground bg-foreground text-background'
										: 'border-border text-foreground hover:border-foreground'} {!purchasable
										? 'cursor-not-allowed opacity-40'
										: ''}"
								>
									{label}
								</button>
							{/if}
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Purchase + wishlist -->
	<div class="flex items-center gap-3 pt-2">
		<button
			type="button"
			class="inline-flex h-12 items-center justify-center rounded-full bg-primary px-10 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
			onclick={handleAddToCart}
			disabled={!canAddToCart}
		>
			{#if !hasCompleteVariantSelection}
				Select options
			{:else if !isPurchasable}
				Out of stock
			{:else if adding}
				Adding...
			{:else}
				Purchase
			{/if}
		</button>
		<button
			type="button"
			class="grid size-12 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
			onclick={() => wishlist.toggleWishlist(product.id, selectedVariantId)}
			aria-label={wishlisted ? 'Remove from favorites' : 'Add to favorites'}
		>
			<Heart class="size-5 {wishlisted ? 'fill-brand text-brand' : 'text-foreground'}" />
		</button>
	</div>
</div>
