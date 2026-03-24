<script lang="ts">
import type { Item, Product } from "@commercengine/storefront";
import { untrack } from "svelte";
import ProductCarousel from "$lib/components/ProductCarousel.svelte";
import ProductDescription from "$lib/components/ProductDescription.svelte";
import ProductImageGallery from "$lib/components/ProductImageGallery.svelte";
import ProductInfo from "$lib/components/ProductInfo.svelte";
import { findVariantBySelection, getVariantOptionSelection } from "$lib/variants";

interface Props {
  product: Product;
  similarItems?: Item[];
}

let { product, similarItems = [] }: Props = $props();

let selectedOptions = $state<Record<string, string>>({});

const optionKeys = $derived(product.variant_options?.map((o) => o.key) ?? []);

const allOptionsSelected = $derived(
  optionKeys.length > 0 && optionKeys.every((k) => !!selectedOptions[k])
);

const selectedVariant = $derived(
  findVariantBySelection(product.variants, optionKeys, selectedOptions)
);

const selectedVariantId = $derived(selectedVariant?.id ?? null);

const displayImages = $derived(
  selectedVariant?.images?.length ? selectedVariant.images : (product.images ?? [])
);

// Initialize selected options from URL variant slug on mount
$effect(() => {
  const variantSlug = new URLSearchParams(window.location.search).get("variant");
  if (variantSlug && product.has_variant) {
    const variant = product.variants.find((v) => v.slug === variantSlug);
    if (variant) {
      const keys = untrack(() => optionKeys);
      selectedOptions = getVariantOptionSelection(variant, keys);
    }
  }
});

function handleOptionChange(optionKey: string, optionValue: string) {
  selectedOptions = { ...selectedOptions, [optionKey]: optionValue };

  const nextOptionKeys = product.variant_options?.map((o) => o.key) ?? [];
  const nextAllSelected =
    nextOptionKeys.length > 0 && nextOptionKeys.every((k) => !!selectedOptions[k]);

  if (nextAllSelected) {
    const matchedVariant = findVariantBySelection(
      product.variants,
      nextOptionKeys,
      selectedOptions
    );
    if (matchedVariant) {
      const url = new URL(window.location.href);
      url.searchParams.set("variant", matchedVariant.slug);
      window.history.replaceState({}, "", url.toString());
    }
  }
}
</script>

<div class="w-full px-6 mt-8">
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
		<ProductImageGallery images={displayImages} productName={product.name} />
		<div>
			<ProductInfo
				{product}
				{selectedVariantId}
				{selectedOptions}
				{allOptionsSelected}
				onoptionchange={handleOptionChange}
			/>
			<ProductDescription {product} />
		</div>
	</div>
</div>

{#if similarItems.length > 0}
	<section class="mt-16 mb-16">
		<h2 class="text-lg font-light text-foreground px-6 mb-6">You may also like</h2>
		<ProductCarousel items={similarItems} />
	</section>
{/if}
