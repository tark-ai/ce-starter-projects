<script lang="ts">
import type { Item } from "@commercengine/storefront";
import { page as pageState } from "$app/state";
import { replaceState } from "$app/navigation";
import DetailAccordions from "$lib/components/product/DetailAccordions.svelte";
import HowToUse from "$lib/components/product/HowToUse.svelte";
import ProductImageGallery from "$lib/components/product/ProductImageGallery.svelte";
import ProductInfo from "$lib/components/product/ProductInfo.svelte";
import RelatedProducts from "$lib/components/product/RelatedProducts.svelte";
import Reveal from "$lib/components/Reveal.svelte";
import { safeJsonLd } from "$lib/json-ld";
import type { SojaProductDetail } from "$lib/product-meta";
import { SITE_NAME, SITE_URL } from "$lib/seo";
import { getSdk } from "$lib/storefront";
import {
  findVariantBySelection,
  getDefaultVariant,
  getVariantOptionSelection,
  hasAllOptionsSelected,
  optionQueryParamKey,
} from "$lib/variants";

let { data } = $props();

// The page is prerendered, so a catalog failure during the build bakes an empty
// payload that no amount of waiting will fill — the client has to ask again.
// SvelteKit reuses this component across slugs, so recovery state carries the slug
// it belongs to and every read below checks it against the slug on screen.
let recovered = $state<{
  slug: string;
  product: SojaProductDetail;
  similarItems: Item[];
} | null>(null);
// The attempt covering `slug`, still open while `pending`.
let attempt = $state<{ slug: string; seq: number; pending: boolean } | null>(null);
// Only the newest attempt may commit: it holds the ticket this counter minted, so
// a superseding request — or the slug change that retires the record — locks it out.
let requestSeq = 0;

const recoveredHere = $derived(recovered?.slug === data.slug ? recovered : null);
const attemptHere = $derived(attempt?.slug === data.slug ? attempt : null);

// Pending until the browser has actually tried this slug, so the prerendered HTML
// bakes the loading state rather than the failure copy, and hydration agrees.
const isRecovering = $derived(attemptHere?.pending ?? true);
const product = $derived(data.product ?? recoveredHere?.product ?? null);
const similarItems = $derived(
  data.product ? data.similarItems : (recoveredHere?.similarItems ?? [])
);
const params = $derived(pageState.url.searchParams);

async function recoverProduct(slug: string) {
  const seq = ++requestSeq;
  attempt = { slug, seq, pending: true };
  // Another slug's payload can no longer render, but don't let it outlive the visit.
  // A refresh of this slug keeps what it has, so there is no skeleton flash.
  if (recovered?.slug !== slug) recovered = null;

  try {
    const sdk = getSdk();
    const similar = sdk.catalog
      .listSimilarProducts({ product_id: [slug] })
      .then((response) => response.data?.products ?? [])
      .catch(() => []);

    const { data: detailData, error } = await sdk.catalog.getProductDetail({ product_id: slug });
    if (attempt?.seq !== seq) return;

    if (error) throw new Error(error.message);
    const fetched: SojaProductDetail | null = detailData?.product ?? null;
    if (!fetched) throw new Error(`Catalog has no product for "${slug}"`);

    recovered = { slug, product: fetched, similarItems: [] };

    void similar.then((items) => {
      if (attempt?.seq !== seq || items.length === 0) return;
      recovered = { slug, product: fetched, similarItems: items };
    });
  } catch (error) {
    if (attempt?.seq !== seq) return;
    // biome-ignore lint/suspicious/noConsole: surface catalog failures
    console.error("Failed to recover product detail:", error);
  } finally {
    // A landing whose record is gone leaves no verdict behind: the next visit to
    // that slug starts clean rather than inheriting this one's outcome.
    if (attempt?.seq === seq) attempt = { slug, seq, pending: false };
  }
}

// Effects never run during prerender, so this is browser-only by construction.
$effect(() => {
  const slug = data.slug;
  // The component survives a parameter change, its bookkeeping must not: retire an
  // attempt made for the slug we came from, so returning here tries again.
  if (attempt && attempt.slug !== slug) attempt = null;
  if (data.product) return;
  // recoverProduct claims the slug synchronously, so this never double-fires;
  // a retry the reader asks for goes through the button instead.
  if (attempt) return;
  void recoverProduct(slug);
});

// A store may have no variants configured at all.
const variants = $derived(product?.variants ?? []);
const optionKeys = $derived(product?.variant_options?.map((option) => option.key) ?? []);

const selectedOptions = $derived.by(() => {
  const selection: Record<string, string> = {};
  for (const key of optionKeys) {
    const value = params.get(optionQueryParamKey(key));
    if (value) selection[key] = value;
  }
  return selection;
});

const allOptionsSelected = $derived(
  !product?.has_variant
    ? false
    : optionKeys.length === 0
      ? true
      : hasAllOptionsSelected(optionKeys, selectedOptions)
);

const variantFromUrl = $derived.by(() => {
  const slug = params.get("variant");
  if (!slug) return null;
  return variants.find((variant) => variant.slug === slug) ?? null;
});

const selectedVariant = $derived.by(() => {
  if (!product?.has_variant) return null;
  if (optionKeys.length === 0) return variantFromUrl ?? getDefaultVariant(product);
  return findVariantBySelection(variants, optionKeys, selectedOptions);
});

const displayImages = $derived(
  selectedVariant?.images?.length ? selectedVariant.images : (product?.images ?? [])
);

function applySearch(next: URLSearchParams) {
  const query = next.toString();
  replaceState(`/product/${data.slug}${query ? `?${query}` : ""}`, {});
}

// The URL is the single source of truth, so a shared link reopens the same variant.
$effect(() => {
  if (!product?.has_variant) return;

  const next = new URLSearchParams(params);

  if (optionKeys.length === 0) {
    const bootstrap = variantFromUrl ?? getDefaultVariant(product);
    if (bootstrap && next.get("variant") !== bootstrap.slug) {
      next.set("variant", bootstrap.slug);
      applySearch(next);
    }
    return;
  }

  let changed = false;
  const hasAnyOptionParam = optionKeys.some((key) => next.has(optionQueryParamKey(key)));

  if (!hasAnyOptionParam) {
    const bootstrap = variantFromUrl ?? getDefaultVariant(product);
    if (bootstrap) {
      const defaults = getVariantOptionSelection(bootstrap, optionKeys);
      for (const key of optionKeys) {
        const value = defaults[key];
        if (!value) continue;
        const queryKey = optionQueryParamKey(key);
        if (next.get(queryKey) !== value) {
          next.set(queryKey, value);
          changed = true;
        }
      }
      if (next.get("variant") !== bootstrap.slug) {
        next.set("variant", bootstrap.slug);
        changed = true;
      }
    }
  } else if (selectedVariant) {
    if (next.get("variant") !== selectedVariant.slug) {
      next.set("variant", selectedVariant.slug);
      changed = true;
    }
  } else if (variantFromUrl) {
    // A valid slug with only some options set: complete the selection from it
    // rather than discarding the variant the link pointed at.
    const selection = getVariantOptionSelection(variantFromUrl, optionKeys);
    let filled = false;
    for (const key of optionKeys) {
      const queryKey = optionQueryParamKey(key);
      if (next.has(queryKey)) continue;
      const value = selection[key];
      if (!value) continue;
      next.set(queryKey, value);
      changed = true;
      filled = true;
    }
    if (!filled && next.has("variant")) {
      next.delete("variant");
      changed = true;
    }
  } else if (next.has("variant")) {
    next.delete("variant");
    changed = true;
  }

  if (changed) applySearch(next);
});

function onoptionchange(optionKey: string, optionValue: string) {
  const next = new URLSearchParams(params);
  next.set(optionQueryParamKey(optionKey), optionValue);

  const selection: Record<string, string> = {};
  for (const key of optionKeys) {
    const value = next.get(optionQueryParamKey(key));
    if (value) selection[key] = value;
  }

  const matched = findVariantBySelection(variants, optionKeys, selection);
  if (matched) {
    next.set("variant", matched.slug);
  } else {
    next.delete("variant");
  }

  applySearch(next);
}

const title = $derived(
  product
    ? `${product.name} | ${SITE_NAME}`
    : isRecovering
      ? `Loading | ${SITE_NAME}`
      : `Product unavailable | ${SITE_NAME}`
);
const description = $derived(
  product?.short_description ??
    (product
      ? `${product.name} from ${SITE_NAME} — hand-crafted bioformulations from Copenhagen.`
      : "")
);
const productUrl = $derived(`${SITE_URL}/product/${data.slug}`);
const productImage = $derived(
  product?.images?.[0]?.url_zoom ?? product?.images?.[0]?.url_standard ?? ""
);

const jsonLd = $derived(
  product
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description,
          ...(productImage ? { image: productImage } : {}),
          sku: product.sku ?? product.slug,
          url: productUrl,
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: product.pricing.currency,
            price: product.pricing.selling_price,
            availability:
              product.stock_available || product.backorder
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
          ...(product.reviews_count > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: (product.reviews_rating_sum / product.reviews_count).toFixed(1),
                  reviewCount: product.reviews_count,
                },
              }
            : {}),
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            ...(product.categories?.[0]
              ? [
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: product.categories[0].name,
                    item: `${SITE_URL}/category/${product.categories[0].slug}`,
                  },
                ]
              : []),
            {
              "@type": "ListItem",
              position: product.categories?.[0] ? 3 : 2,
              name: product.name,
              item: productUrl,
            },
          ],
        },
      ]
    : []
);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={productUrl} />
	{#if !product}
		<!-- A build-time catalog failure baked a placeholder; keep it out of the index. -->
		<meta name="robots" content="noindex" />
	{/if}
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="product" />
	<meta property="og:url" content={productUrl} />
	{#if productImage}
		<meta property="og:image" content={productImage} />
	{/if}
	{#each jsonLd as schema, index (index)}
		{@html `<script type="application/ld+json">${safeJsonLd(schema)}</script>`}
	{/each}
</svelte:head>

<main>
	{#if product}
		<section
			class="mx-auto w-full max-w-[var(--container-soja)] px-3 grid gap-12 pt-12 pb-20 tablet:grid-cols-2 tablet:gap-20 tablet:pt-20"
		>
			<!-- min-w-0 lets the thumbnail strip scroll rather than widening this cell. -->
			<div class="min-w-0 tablet:sticky tablet:top-28 tablet:self-start">
				{#key selectedVariant?.id ?? "base"}
					<ProductImageGallery images={displayImages} productName={product.name} />
				{/key}
			</div>

			<div class="flex flex-col gap-14">
				<Reveal>
					<ProductInfo
						{product}
						selectedVariantId={selectedVariant?.id ?? null}
						{selectedOptions}
						{allOptionsSelected}
						{onoptionchange}
					/>
				</Reveal>
				<Reveal delay={90}>
					<DetailAccordions {product} />
				</Reveal>
			</div>
		</section>

		<HowToUse />

		<RelatedProducts items={similarItems} />
	{:else if isRecovering}
		<section
			class="mx-auto w-full max-w-[var(--container-soja)] px-3 grid gap-12 py-16 tablet:grid-cols-2 tablet:gap-20"
		>
			<div class="aspect-2/3 animate-pulse bg-accent"></div>
			<div class="flex flex-col gap-6 pt-8">
				<div class="h-10 w-3/4 animate-pulse bg-accent"></div>
				<div class="h-4 w-full animate-pulse bg-accent"></div>
				<div class="h-4 w-2/3 animate-pulse bg-accent"></div>
				<div class="mt-6 h-8 w-24 animate-pulse bg-accent"></div>
			</div>
		</section>
		<noscript>
			<!-- Nothing will resolve this skeleton without the client request. -->
			<section class="mx-auto w-full max-w-[var(--container-soja)] px-3 pb-32">
				<p class="max-w-[420px] text-meta leading-relaxed text-muted-foreground">
					This page was built while the catalog was unreachable, and loading it again needs
					JavaScript. <a href="/all-products" class="underline">Shop the collection</a> instead.
				</p>
			</section>
		</noscript>
	{:else}
		<section class="mx-auto w-full max-w-[var(--container-soja)] px-3 py-32">
			<h1 class="font-display text-[2rem] tracking-display">We couldn't load this formulation</h1>
			<p class="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
				The catalog didn't respond when this page was built, and asking for it again just now
				failed too.
			</p>
			<div class="mt-10 flex flex-wrap items-center gap-6">
				<button
					type="button"
					onclick={() => {
						void recoverProduct(data.slug);
					}}
					class="h-12 bg-primary px-8 text-meta text-primary-foreground transition-colors duration-300 ease-soja hover:bg-primary-hover"
				>
					Try again
				</button>
				<a
					href="/all-products"
					class="inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
				>
					Shop the collection
					<span aria-hidden="true" class="h-1.5 w-1.5 bg-current"></span>
				</a>
			</div>
		</section>
	{/if}
</main>
