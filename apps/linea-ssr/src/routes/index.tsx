import { createFileRoute } from "@tanstack/react-router";
import EditorialSection from "@/components/content/EditorialSection";
import FiftyFiftySection from "@/components/content/FiftyFiftySection";
import LargeHero from "@/components/content/LargeHero";
import OneThirdTwoThirdsSection from "@/components/content/OneThirdTwoThirdsSection";
import ProductCarousel from "@/components/content/ProductCarousel";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

const SITE_URL = "https://linea-static.demo.commercengine.com";
const SITE_NAME = "Linea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: `${SITE_NAME} - Minimalist jewelry crafted for the modern individual`,
      },
      {
        name: "description",
        content:
          "Shop Linea's curated collection of minimalist jewelry — rings, necklaces, earrings, and bracelets crafted for the modern individual. Free shipping on all orders.",
      },
      {
        property: "og:title",
        content: `${SITE_NAME} - Minimalist jewelry crafted for the modern individual`,
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${SITE_URL}/og-image.jpg` },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: `${SITE_NAME} - Minimalist jewelry crafted for the modern individual`,
      },
      {
        name: "twitter:description",
        content:
          "Shop Linea's curated collection of minimalist jewelry — rings, necklaces, earrings, and bracelets crafted for the modern individual.",
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
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.svg`,
        }),
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-6">
        <FiftyFiftySection />
        <ProductCarousel />
        <LargeHero />
        <OneThirdTwoThirdsSection />
        <EditorialSection />
      </main>
      <Footer />
    </div>
  );
}
