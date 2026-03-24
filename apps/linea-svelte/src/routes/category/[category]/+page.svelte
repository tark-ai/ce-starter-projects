<script lang="ts">
import CategoryContent from "$lib/components/CategoryContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const title = $derived(`${data.displayName} | ${SITE_NAME}`);
const description = $derived(
  `Shop ${data.displayName} from ${SITE_NAME}. Discover our curated collection of minimalist jewelry crafted for the modern individual.`,
);
const url = $derived(`${SITE_URL}/category/${data.category}`);

const jsonLd = $derived([
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.displayName,
    description,
    url,
    ...(data.skus.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            itemListElement: data.skus.slice(0, 20).map(
              (item: { product_slug: string; product_name: string }, i: number) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/product/${item.product_slug}`,
                name: item.product_name,
              }),
            ),
          },
        }
      : {}),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: data.displayName },
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
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>

<div class="pt-6">
	{#key data.categorySlug ?? data.category}
		<CategoryContent
			category={data.displayName}
			categorySlug={data.categorySlug}
			initialSkus={data.skus}
			initialPagination={data.pagination}
		/>
	{/key}
</div>
