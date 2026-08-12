import { BrandPillars, FeaturedProducts, Hero, Testimonial } from "@ce/soja-shared/content";
import { images } from "@ce/soja-ui/lib/images";
import { safeJsonLd } from "@ce/soja-ui/lib/json-ld";
import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { HOME_COPY } from "@/lib/site-content";
import { SojaLink } from "@/lib/soja-routing";
import { storefront } from "@/lib/storefront";
import { useWishlist } from "@/lib/wishlist";

const FRAMEWORK = "TanStack Start";
const DESCRIPTION = `${SITE_NAME} is a production-ready e-commerce starter template built with Commerce Engine and ${FRAMEWORK}. A reference implementation for a quiet-luxury Scandinavian skincare storefront with full catalog, cart, checkout, and search.`;

export const Route = createFileRoute("/")({
  loader: async () => {
    // One request covers both product rows plus the testimonial's overlapping card.
    try {
      const sdk = storefront.publicStorefront();
      const { data } = await sdk.catalog.listSkus({ page: 1, limit: 24 });
      return { skus: data?.skus ?? [] };
    } catch {
      return { skus: [] };
    }
  },
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — Commerce Engine + ${FRAMEWORK} Starter Template` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: `${SITE_NAME} — Rituals of natural skincare` },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${SITE_NAME} — Rituals of natural skincare` },
      { name: "twitter:description", content: DESCRIPTION },
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
          logo: `${SITE_URL}/icon.png`,
          description: `Commerce Engine is a headless e-commerce platform. ${SITE_NAME} is an open-source reference storefront built with ${FRAMEWORK}.`,
        }),
      },
    ],
  }),
  component: IndexPage,
});

function IndexPage() {
  const { skus } = Route.useLoaderData();
  const wishlist = useWishlist();

  const overlapCard =
    skus.find((sku) => sku.product_slug === HOME_COPY.testimonial.productSlug) ??
    skus[8] ??
    skus[0];

  return (
    // -mt-20 pulls the hero up under the transparent header on this route.
    <main className="-mt-20">
      <Hero
        LinkComponent={SojaLink}
        title={HOME_COPY.hero.title}
        body={HOME_COPY.hero.body}
        ctaLabel={HOME_COPY.hero.cta}
        ctaRoute={{ path: "/all-products" }}
      />

      <FeaturedProducts
        items={skus.slice(0, 4)}
        LinkComponent={SojaLink}
        lede={HOME_COPY.featured.lede}
        eyebrow={{ label: "Shop the collection", route: { path: "/all-products" } }}
        wishlist={wishlist}
        ctas={[
          {
            label: "Shop skincare",
            route: { path: "/category/skin-care" },
            image: images.shopSkincare,
            imageAlt: "Soja skincare formulations",
          },
          {
            label: "Shop hand and body",
            route: { path: "/category/hand-and-body" },
            image: images.shopHairBody,
            imageAlt: "Soja hand and body formulations",
          },
        ]}
      />

      <FeaturedProducts
        items={skus.slice(4, 8)}
        LinkComponent={SojaLink}
        lede={HOME_COPY.popular.lede}
        wishlist={wishlist}
      />

      <Testimonial
        quote={HOME_COPY.testimonial.quote}
        author={HOME_COPY.testimonial.author}
        featured={overlapCard}
        LinkComponent={SojaLink}
        wishlist={wishlist}
      />

      <BrandPillars />
    </main>
  );
}
