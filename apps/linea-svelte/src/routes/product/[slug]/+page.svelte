<script lang="ts">
import ProductContent from "$lib/components/ProductContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const product = $derived(data.product);
const title = $derived(product.seo?.title || `${product.name} | ${SITE_NAME}`);
const description = $derived(
  product.seo?.description || product.short_description || `Shop ${product.name} from ${SITE_NAME}`,
);
const image = $derived(product.images?.[0]?.url_zoom ?? product.images?.[0]?.url_standard ?? "");
const url = $derived(`${SITE_URL}/product/${product.slug}`);

const jsonLd = $derived([
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
      },
    ],
  },
]);
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
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>

<div class="pt-6">
	{#key data.product.id}
		<ProductContent product={data.product} similarItems={data.similarItems} />
	{/key}
</div>
