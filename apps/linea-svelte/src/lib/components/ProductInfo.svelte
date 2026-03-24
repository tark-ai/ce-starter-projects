<script lang="ts">
import { formatPrice } from "@ce/ui/lib/format";
import type { Product, VariantOption } from "@commercengine/storefront";
import { Heart, Minus, Plus } from "lucide-svelte";
import { checkout } from "$lib/checkout.svelte";
import { routeToHref } from "$lib/linea-routing";
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

let quantity = $state(1);
let adding = $state(false);

const selectedVariant = $derived(
  product.has_variant ? product.variants.find((v) => v.id === selectedVariantId) : null
);

const displayPrice = $derived(
  selectedVariant?.pricing?.selling_price ?? product.pricing.selling_price
);

const displayCurrency = $derived(selectedVariant?.pricing?.currency ?? product.pricing.currency);

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

const wishlisted = $derived(wishlist.isInWishlist(product.id, selectedVariantId));

const categoryName = $derived(product.categories?.[0]?.name);
const categorySlug = $derived(product.categories?.[0]?.slug);

type OptionValueInfo = {
  selectionValue: string;
  label: string;
  hexcode?: string;
  isPurchasable: boolean;
};

type OptionGroup = {
  option: VariantOption;
  values: OptionValueInfo[];
};

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
      const selectionValue = rawValue.name;
      if (seen.has(selectionValue)) continue;
      seen.add(selectionValue);
      values.push({ selectionValue, label: rawValue.name, hexcode: rawValue.hexcode });
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

  return product.variant_options.map((option) => {
    const resolvedValues = getVariantOptionValues(option).map((optionValue) => {
      const candidateSelection = {
        ...baseSelection,
        [option.key]: optionValue.selectionValue,
      };
      const purchasable = product.variants.some((variant) => {
        return matchesSelection(variant, candidateSelection) && isVariantPurchasable(variant);
      });

      return {
        selectionValue: optionValue.selectionValue,
        label: optionValue.label,
        hexcode: optionValue.hexcode,
        isPurchasable: purchasable,
      };
    });

    return { option, values: resolvedValues };
  });
});

async function handleAddToCart() {
  if (product.has_variant && !selectedVariantId) return;
  adding = true;
  try {
    await checkout.addToCart(product.id, selectedVariantId, quantity);
  } finally {
    adding = false;
  }
}
</script>

<div class="space-y-6">
	<!-- Breadcrumb -->
	<nav class="hidden lg:block" aria-label="Breadcrumb">
		<ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
			<li>
				<a href={routeToHref({ path: '/' })} class="hover:text-foreground transition-colors">
					Home
				</a>
			</li>
			{#if categoryName && categorySlug}
				<li class="text-muted-foreground/50">/</li>
				<li>
					<a
						href={routeToHref({ path: `/category/${categorySlug}` })}
						class="hover:text-foreground transition-colors"
					>
						{categoryName}
					</a>
				</li>
			{/if}
			<li class="text-muted-foreground/50">/</li>
			<li class="text-foreground">{product.name}</li>
		</ol>
	</nav>

	<!-- Product name and price -->
	<div class="space-y-2">
		<div class="flex justify-between items-start">
			<div>
				{#if categoryName}
					<p class="text-sm font-light text-muted-foreground mb-1">{categoryName}</p>
				{/if}
				<h1 class="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
			</div>
			<div class="text-right">
				<p class="text-xl font-light text-foreground">
					{formatPrice(displayPrice, displayCurrency)}
				</p>
			</div>
		</div>
	</div>

	<!-- Variant options -->
	{#if product.has_variant && product.variant_options}
		<div class="space-y-4 py-4 border-b border-border">
			{#each optionGroups as { option, values } (option.key)}
				<div class="space-y-2">
					<h3 class="text-sm font-light text-foreground capitalize">{option.name}</h3>
					<div class="flex flex-wrap gap-2">
						{#each values as { selectionValue, label, hexcode, isPurchasable: purchasable } (`${option.key}-${selectionValue}`)}
							{@const isColor = option.type === 'color'}
							{@const isSelected = selectedOptions[option.key] === selectionValue}
							<button
								type="button"
								onclick={() => onoptionchange(option.key, selectionValue)}
								aria-disabled={!purchasable}
								disabled={!purchasable}
								title={label}
								class="text-sm font-light border transition-colors {isColor
									? 'size-9 rounded-full p-0.5'
									: 'px-4 py-2'} {isSelected
									? 'border-foreground'
									: 'border-border hover:border-foreground'} {!purchasable
									? 'opacity-50 cursor-not-allowed'
									: ''}"
							>
								{#if isColor}
									<span
										class="block size-full rounded-full"
										style:background-color={hexcode}
									></span>
								{:else}
									{label}
								{/if}
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Attributes -->
	{#if product.attributes.length > 0}
		<div class="space-y-4 py-4 border-b border-border">
			{#each product.attributes as attr (attr.key)}
				<div class="space-y-2">
					<h3 class="text-sm font-light text-foreground capitalize">{attr.name}</h3>
					<p class="text-sm font-light text-muted-foreground">{String(attr.value)}</p>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Quantity and Add to cart -->
	<div class="space-y-4">
		<div class="flex items-center gap-4">
			<span class="text-sm font-light text-foreground">Quantity</span>
			<div class="flex items-center border border-border">
				<button
					type="button"
					onclick={() => (quantity = Math.max(1, quantity - 1))}
					class="h-10 w-10 p-0 flex items-center justify-center hover:opacity-50 transition-opacity"
					aria-label="Decrease quantity"
				>
					<Minus class="h-4 w-4" />
				</button>
				<span
					class="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border"
				>
					{quantity}
				</span>
				<button
					type="button"
					onclick={() => (quantity = quantity + 1)}
					class="h-10 w-10 p-0 flex items-center justify-center hover:opacity-50 transition-opacity"
					aria-label="Increase quantity"
				>
					<Plus class="h-4 w-4" />
				</button>
			</div>
		</div>

		<div class="flex gap-3">
			<button
				type="button"
				class="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 font-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				onclick={handleAddToCart}
				disabled={!canAddToCart}
			>
				{#if !hasCompleteVariantSelection}
					Select options
				{:else if !isPurchasable}
					Out of Stock
				{:else if adding}
					Adding...
				{:else}
					Add to Bag
				{/if}
			</button>
			<button
				type="button"
				class="h-12 w-12 shrink-0 border border-border hover:bg-transparent flex items-center justify-center transition-colors"
				onclick={() => wishlist.toggleWishlist(product.id, selectedVariantId)}
				aria-label={wishlisted ? 'Remove from favorites' : 'Add to favorites'}
			>
				<Heart
					class="h-5 w-5 transition-colors {wishlisted
						? 'fill-red-500 text-red-500'
						: 'text-foreground'}"
				/>
			</button>
		</div>
	</div>
</div>
