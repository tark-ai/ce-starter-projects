<script lang="ts">
import EditorialSection from "$lib/components/EditorialSection.svelte";
import FiftyFiftySection from "$lib/components/FiftyFiftySection.svelte";
import LargeHero from "$lib/components/LargeHero.svelte";
import OneThirdTwoThirdsSection from "$lib/components/OneThirdTwoThirdsSection.svelte";
import ProductCarousel from "$lib/components/ProductCarousel.svelte";
import { DEFAULT_DESCRIPTION, FRAMEWORK, SITE_NAME, SITE_URL } from "$lib/seo";

let { data } = $props();

const HOME_TITLE = `${SITE_NAME} — Commerce Engine + ${FRAMEWORK} Starter Template`;

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
	<meta property="og:url" content={SITE_URL} />
	{#each jsonLd as schema}
		{@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
	{/each}
</svelte:head>

<div class="pt-6">
	<FiftyFiftySection />
	<ProductCarousel items={data.products} />
	<LargeHero />
	<OneThirdTwoThirdsSection />
	<EditorialSection />
</div>
