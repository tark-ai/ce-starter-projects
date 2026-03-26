/** biome-ignore-all lint/suspicious/noConsole: used to detect API errors during build time */
import { createFileRoute } from "@tanstack/react-router";
import EditorialSection from "@/components/content/EditorialSection";
import FiftyFiftySection from "@/components/content/FiftyFiftySection";
import LargeHero from "@/components/content/LargeHero";
import OneThirdTwoThirdsSection from "@/components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "@/components/content/ProductCarousel";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { storefront } from "@/lib/storefront";

const FRAMEWORK = "TanStack Start";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const sdk = storefront.publicStorefront();
      const { data, error } = await sdk.catalog.listSkus({ page: 1, limit: 20 });
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
          "LINEA is a production-ready e-commerce starter template built with Commerce Engine and TanStack Start. A reference implementation featuring a minimalist jewelry storefront with full catalog, cart, checkout, and search.",
      },
      {
        property: "og:title",
        content: `${SITE_NAME} — Commerce Engine + TanStack Start Starter Template`,
      },
      {
        property: "og:description",
        content:
          "LINEA is a production-ready e-commerce starter template built with Commerce Engine and TanStack Start. A reference implementation featuring a minimalist jewelry storefront with full catalog, cart, checkout, and search.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: `${SITE_NAME} — Commerce Engine + TanStack Start Starter Template`,
      },
      {
        name: "twitter:description",
        content:
          "LINEA is a production-ready e-commerce starter template built with Commerce Engine and TanStack Start. A reference implementation featuring a minimalist jewelry storefront with full catalog, cart, checkout, and search.",
      },
      { name: "twitter:image", content: `${SITE_URL}/og-image.jpg` },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
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
        children: JSON.stringify({
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
    <main className="pt-6">
      <FiftyFiftySection />
      <ProductCarousel serverProducts={products} />
      <LargeHero />
      <OneThirdTwoThirdsSection />
      <EditorialSection />
    </main>
  );
}
