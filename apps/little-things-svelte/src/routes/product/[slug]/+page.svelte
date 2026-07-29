<script lang="ts">
import ProductContent from "$lib/components/product/ProductContent.svelte";
import { safeJsonLd } from "$lib/json-ld";
import { SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const product = $derived(data.product);
const title = $derived(
  product ? `${product.name} | ${SITE_NAME}` : `Product not found | ${SITE_NAME}`
);
const description = $derived(
  product?.short_description ||
    (product ? `Shop ${product.name} from ${SITE_NAME}.` : "Product not found.")
);
const image = $derived(
  product?.images?.[0]?.url_zoom ?? product?.images?.[0]?.url_standard ?? ""
);
const url = $derived(product ? `${SITE_URL}/product/${product.slug}` : `${SITE_URL}`);

const jsonLd = $derived(
  product
    ? [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description,
          image,
          sku: product.sku ?? product.slug,
          url,
          brand: { "@type": "Brand", name: SITE_NAME },
          offers: {
            "@type": "Offer",
            url,
            priceCurrency: product.pricing.currency,
            // The static/SSR page has no selected variant at render time, so the
            // base product's selling price is used as the representative Offer
            // price. Variant-specific pricing is reflected client-side once a
            // variant is chosen.
            price: product.pricing.selling_price,
            availability:
              product.stock_available || product.backorder
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        },
      ]
    : []
);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content="product" />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${safeJsonLd(schema)}</script>`}
	{/each}
</svelte:head>

{#if product}
	{#key product.id}
		<ProductContent {product} similarItems={data.similarItems} />
	{/key}
{:else}
	<div class="mx-auto max-w-[1400px] px-6 py-24 text-center lg:px-20">
		<p class="text-sm font-light text-muted-foreground">
			Product not found. It may have sold out or wandered off.
		</p>
	</div>
{/if}
