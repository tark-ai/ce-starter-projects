<script lang="ts">
import { ARTICLES } from "$lib/blog-data";
import BrowseCategories from "$lib/components/home/BrowseCategories.svelte";
import FeaturedProducts from "$lib/components/home/FeaturedProducts.svelte";
import Hero from "$lib/components/home/Hero.svelte";
import LatestArticles from "$lib/components/home/LatestArticles.svelte";
import { DEFAULT_DESCRIPTION, FRAMEWORK, SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const HOME_TITLE = `${SITE_NAME} — Commerce Engine + ${FRAMEWORK} Starter Template`;

// Real product image URLs for the editorial tiles (2 featured + 3 category tiles).
const imageUrls = $derived.by(() => {
  const urls = data.products
    .map((sku) => sku.images?.[0]?.url_standard ?? sku.images?.[0]?.url_thumbnail ?? undefined)
    .filter((url): url is string => Boolean(url));
  const at = (i: number) => (urls.length ? urls[i % urls.length] : undefined);
  return [at(8), at(9), at(5), at(6), at(7)].filter((url): url is string => Boolean(url));
});

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Commerce Engine",
    url: "https://www.commercengine.io",
    logo: `${SITE_URL}/favicon.svg`,
    description: `Commerce Engine is a headless e-commerce platform. ${SITE_NAME} is an open-source reference storefront built with ${FRAMEWORK}.`,
  },
];
</script>

<svelte:head>
	<title>{HOME_TITLE}</title>
	<meta name="description" content={DEFAULT_DESCRIPTION} />
	<link rel="canonical" href={SITE_URL} />
	<meta property="og:title" content={HOME_TITLE} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={SITE_URL} />
	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>

<Hero />
<FeaturedProducts items={data.products} />
<BrowseCategories {imageUrls} />
<LatestArticles articles={ARTICLES} />
