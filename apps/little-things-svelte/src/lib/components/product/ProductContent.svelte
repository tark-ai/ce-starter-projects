<script lang="ts">
import type { Item, Product } from "@commercengine/storefront";
import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import {
  findVariantBySelection,
  getDefaultVariant,
  getVariantOptionSelection,
  hasAllOptionsSelected,
  optionQueryParamKey,
} from "$lib/variants";
import DetailTabs from "./DetailTabs.svelte";
import ProductImageGallery from "./ProductImageGallery.svelte";
import ProductInfo from "./ProductInfo.svelte";
import RelatedProducts from "./RelatedProducts.svelte";

interface Props {
  product: Product;
  similarItems?: Item[];
}

let { product, similarItems = [] }: Props = $props();

const optionKeys = $derived(product.variant_options?.map((option) => option.key) ?? []);
const emptySearchParams = new URLSearchParams();

function getSearchParams() {
  return browser ? page.url.searchParams : emptySearchParams;
}

const variantFromUrl = $derived.by(() => {
  if (!product.has_variant) return null;
  const variantSlug = getSearchParams().get("variant");
  if (!variantSlug) return null;
  return product.variants.find((variant) => variant.slug === variantSlug) ?? null;
});

const selectedOptions = $derived.by(() => {
  if (!product.has_variant) return {};

  const selection: Record<string, string> = {};
  let hasAnyOptionParam = false;

  for (const optionKey of optionKeys) {
    const value = getSearchParams().get(optionQueryParamKey(optionKey));
    if (!value) continue;
    selection[optionKey] = value;
    hasAnyOptionParam = true;
  }

  if (optionKeys.length === 0) return selection;

  if (!hasAnyOptionParam) {
    const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
    return bootstrapVariant ? getVariantOptionSelection(bootstrapVariant, optionKeys) : selection;
  }

  if (!variantFromUrl) return selection;

  const variantSelection = getVariantOptionSelection(variantFromUrl, optionKeys);
  const mergedSelection = { ...selection };
  for (const optionKey of optionKeys) {
    if (!mergedSelection[optionKey] && variantSelection[optionKey]) {
      mergedSelection[optionKey] = variantSelection[optionKey];
    }
  }
  return mergedSelection;
});

const allOptionsSelected = $derived(
  product.has_variant &&
    (optionKeys.length === 0 || hasAllOptionsSelected(optionKeys, selectedOptions))
);

const selectedVariant = $derived.by(() => {
  if (!product.has_variant) return null;
  if (optionKeys.length === 0) return variantFromUrl ?? getDefaultVariant(product);
  return findVariantBySelection(product.variants, optionKeys, selectedOptions);
});

const selectedVariantId = $derived(selectedVariant?.id ?? null);

const displayImages = $derived(
  selectedVariant?.images?.length ? selectedVariant.images : (product.images ?? [])
);

function replaceSearchParams(nextParams: URLSearchParams) {
  const query = nextParams.toString();
  const nextUrl = query ? `${page.url.pathname}?${query}` : page.url.pathname;
  replaceState(nextUrl, page.state);
}

$effect(() => {
  if (!browser || !product.has_variant) return;

  const nextParams = new URLSearchParams(page.url.searchParams);
  let changed = false;

  const hasAnyOptionParam = optionKeys.some((key) => nextParams.has(optionQueryParamKey(key)));

  if (optionKeys.length === 0) {
    const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
    if (bootstrapVariant && nextParams.get("variant") !== bootstrapVariant.slug) {
      nextParams.set("variant", bootstrapVariant.slug);
      changed = true;
    }
    if (changed) replaceSearchParams(nextParams);
    return;
  }

  if (!hasAnyOptionParam) {
    const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
    if (bootstrapVariant) {
      const defaultSelection = getVariantOptionSelection(bootstrapVariant, optionKeys);
      for (const optionKey of optionKeys) {
        const value = defaultSelection[optionKey];
        if (!value) continue;
        const queryKey = optionQueryParamKey(optionKey);
        if (nextParams.get(queryKey) !== value) {
          nextParams.set(queryKey, value);
          changed = true;
        }
      }
      if (nextParams.get("variant") !== bootstrapVariant.slug) {
        nextParams.set("variant", bootstrapVariant.slug);
        changed = true;
      }
    }
  } else if (selectedVariant) {
    if (nextParams.get("variant") !== selectedVariant.slug) {
      nextParams.set("variant", selectedVariant.slug);
      changed = true;
    }
  } else if (variantFromUrl) {
    const variantSelection = getVariantOptionSelection(variantFromUrl, optionKeys);
    let filledMissingOption = false;
    for (const optionKey of optionKeys) {
      const queryKey = optionQueryParamKey(optionKey);
      if (nextParams.has(queryKey)) continue;
      const value = variantSelection[optionKey];
      if (!value) continue;
      nextParams.set(queryKey, value);
      changed = true;
      filledMissingOption = true;
    }
    if (!filledMissingOption && nextParams.has("variant")) {
      nextParams.delete("variant");
      changed = true;
    }
  } else if (nextParams.has("variant")) {
    nextParams.delete("variant");
    changed = true;
  }

  if (changed) replaceSearchParams(nextParams);
});

function handleOptionChange(optionKey: string, optionValue: string) {
  if (!product.has_variant) return;

  const nextParams = new URLSearchParams(page.url.searchParams);
  nextParams.set(optionQueryParamKey(optionKey), optionValue);

  const nextSelection: Record<string, string> = {};
  for (const key of optionKeys) {
    const value = nextParams.get(optionQueryParamKey(key));
    if (value) nextSelection[key] = value;
  }

  const matchedVariant = findVariantBySelection(product.variants, optionKeys, nextSelection);
  if (matchedVariant) {
    nextParams.set("variant", matchedVariant.slug);
  } else {
    nextParams.delete("variant");
  }

  replaceSearchParams(nextParams);
}
</script>

<main class="pt-8 lg:pt-16">
	<section class="mx-auto w-full max-w-[1400px] px-6 lg:px-20">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
			<div class="lg:sticky lg:top-24 lg:self-start">
				{#key selectedVariant?.id ?? 'base'}
					<ProductImageGallery images={displayImages} productName={product.name} />
				{/key}
			</div>

			<div class="space-y-10">
				<ProductInfo
					{product}
					{selectedVariantId}
					{selectedOptions}
					{allOptionsSelected}
					onoptionchange={handleOptionChange}
				/>
				<DetailTabs {product} />
			</div>
		</div>
	</section>

	{#if similarItems.length > 0}
		<section class="mt-16 w-full lg:mt-24">
			<RelatedProducts items={similarItems} />
		</section>
	{/if}
</main>
