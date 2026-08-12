<script lang="ts">
import CategoryContent from "$lib/components/category/CategoryContent.svelte";
import { safeJsonLd } from "$lib/json-ld";
import { SITE_NAME, SITE_URL } from "$lib/seo";
import { PLP_COPY } from "$lib/site-content";

let { data } = $props();

const title = $derived(`${data.categoryName} | ${SITE_NAME}`);
const description = $derived(data.categoryDescription || PLP_COPY.subtitle);
const url = $derived(`${SITE_URL}/category/${data.categorySlug}`);

const jsonLd = $derived([
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.categoryName,
    description,
    url,
    ...(data.skus.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: data.skus.slice(0, 20).map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}/product/${item.product_slug}`,
              name: item.product_name,
            })),
          },
        }
      : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: data.categoryName, item: url },
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
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	{#each jsonLd as schema, index (index)}
		{@html `<script type="application/ld+json">${safeJsonLd(schema)}</script>`}
	{/each}
</svelte:head>

{#key data.categorySlug}
	<CategoryContent
		categorySlug={data.categorySlug}
		categoryName={data.categoryName}
		categoryDescription={data.categoryDescription}
		categories={data.categories}
		initialSkus={data.skus}
		initialPagination={data.pagination}
	/>
{/key}
