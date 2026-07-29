<script lang="ts">
import CategoryContent from "$lib/components/category/CategoryContent.svelte";
import { SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const title = $derived(`${data.displayName} | ${SITE_NAME}`);
const description = $derived(
  `Shop ${data.displayName} from ${SITE_NAME}. A tight, opinionated catalog of things worth owning.`
);
const url = $derived(`${SITE_URL}/category/${data.category}`);

const jsonLd = $derived([
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: data.displayName,
    description,
    url,
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
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>

{#key data.categorySlug ?? data.category}
	<CategoryContent
		displayName={data.displayName}
		categorySlug={data.categorySlug}
		initialSkus={data.skus}
		initialPagination={data.pagination}
	/>
{/key}
