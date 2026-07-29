/** biome-ignore-all lint/suspicious/noConsole: used to detect API errors during build time */
import { safeJsonLd } from "@ce/little-things-ui/lib/json-ld";
import { createFileRoute } from "@tanstack/react-router";
import BrowseCategories from "@/components/content/BrowseCategories";
import FeaturedProducts from "@/components/content/FeaturedProducts";
import Hero from "@/components/content/Hero";
import LatestArticles from "@/components/content/LatestArticles";
import { ARTICLES } from "@/lib/blog-data";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { storefront } from "@/lib/storefront";

const FRAMEWORK = "TanStack Start";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const sdk = storefront.publicStorefront();
      const { data, error } = await sdk.catalog.listSkus({ page: 1, limit: 6 });
      if (error) {
        console.error("[loader /] Failed to load products:", error.message);
      }
      return { products: data?.skus ?? [] };
    } catch (e) {
      console.error("[loader /] Unexpected error:", e);
      return { products: [] };
    }
  },
  head: () => ({
    meta: [
      {
        title: `${SITE_NAME} — Commerce Engine + TanStack Start Starter Template`,
      },
      {
        name: "description",
        content:
          "Little Things is a production-ready e-commerce starter template built with Commerce Engine and TanStack Start. A reference implementation featuring a tight, opinionated everyday-goods storefront with full catalog, cart, checkout, and search.",
      },
      {
        property: "og:title",
        content: `${SITE_NAME} — Commerce Engine + TanStack Start Starter Template`,
      },
      {
        property: "og:description",
        content:
          "Little Things is a production-ready e-commerce starter template built with Commerce Engine and TanStack Start. A reference implementation featuring a tight, opinionated everyday-goods storefront with full catalog, cart, checkout, and search.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: `${SITE_NAME} — Commerce Engine + TanStack Start Starter Template`,
      },
      {
        name: "twitter:description",
        content:
          "Little Things is a production-ready e-commerce starter template built with Commerce Engine and TanStack Start. A reference implementation featuring a tight, opinionated everyday-goods storefront with full catalog, cart, checkout, and search.",
      },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: safeJsonLd({
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
        }),
      },
      {
        type: "application/ld+json",
        children: safeJsonLd({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Commerce Engine",
          url: "https://www.commercengine.io",
          logo: `${SITE_URL}/favicon.svg`,
          description: `Commerce Engine is a headless e-commerce platform. ${SITE_NAME} is an open-source reference storefront built with ${FRAMEWORK}.`,
        }),
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { products } = Route.useLoaderData();

  return (
    <main>
      <Hero />
      <FeaturedProducts items={products} isLoading={false} />
      <BrowseCategories />
      <LatestArticles articles={ARTICLES} />
    </main>
  );
}
