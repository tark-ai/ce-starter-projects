<script lang="ts">
import { images } from "@ce/soja-ui/lib/images";
import BrandPillars from "$lib/components/home/BrandPillars.svelte";
import FeaturedProducts from "$lib/components/home/FeaturedProducts.svelte";
import Hero from "$lib/components/home/Hero.svelte";
import Testimonial from "$lib/components/home/Testimonial.svelte";
import { safeJsonLd } from "$lib/json-ld";
import { DEFAULT_DESCRIPTION, FRAMEWORK, SITE_NAME, SITE_URL } from "$lib/seo";
import { HOME_COPY } from "$lib/site-content";

let { data } = $props();

const TITLE = `${SITE_NAME} — Commerce Engine + ${FRAMEWORK} Starter Template`;

const overlapCard = $derived(
  data.skus.find((sku) => sku.product_slug === HOME_COPY.testimonial.productSlug) ??
    data.skus[8] ??
    data.skus[0]
);

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
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
    logo: `${SITE_URL}/icon.png`,
    description: `Commerce Engine is a headless e-commerce platform. ${SITE_NAME} is an open-source reference storefront built with ${FRAMEWORK}.`,
  },
];
</script>

<svelte:head>
	<title>{TITLE}</title>
	<meta name="description" content={DEFAULT_DESCRIPTION} />
	<link rel="canonical" href={SITE_URL} />
	<meta property="og:title" content={`${SITE_NAME} — Rituals of natural skincare`} />
	<meta property="og:description" content={DEFAULT_DESCRIPTION} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={SITE_URL} />
	{#each jsonLd as schema, index (index)}
		{@html `<script type="application/ld+json">${safeJsonLd(schema)}</script>`}
	{/each}
</svelte:head>

<!-- -mt-20 pulls the hero up under the transparent header on this route. -->
<main class="-mt-20">
	<Hero
		title={HOME_COPY.hero.title}
		body={HOME_COPY.hero.body}
		ctaLabel={HOME_COPY.hero.cta}
	/>

	<FeaturedProducts
		items={data.skus.slice(0, 4)}
		lede={HOME_COPY.featured.lede}
		eyebrow={{ label: "Shop the collection", route: { path: "/all-products" } }}
		ctas={[
			{
				label: "Shop skincare",
				route: { path: "/category/skin-care" },
				image: images.shopSkincare,
				imageAlt: "Soja skincare formulations",
			},
			{
				label: "Shop hair and body",
				route: { path: "/category/hand-and-body" },
				image: images.shopHairBody,
				imageAlt: "Soja hair and body formulations",
			},
		]}
	/>

	<FeaturedProducts items={data.skus.slice(4, 8)} lede={HOME_COPY.popular.lede} />

	<Testimonial
		quote={HOME_COPY.testimonial.quote}
		author={HOME_COPY.testimonial.author}
		featured={overlapCard}
	/>

	<BrandPillars />
</main>
