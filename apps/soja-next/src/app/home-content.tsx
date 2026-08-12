"use client";

import { BrandPillars, FeaturedProducts, Hero, Testimonial } from "@ce/soja-shared/content";
import { images } from "@ce/soja-ui/lib/images";
import type { Item } from "@commercengine/storefront";
import { HOME_COPY } from "@/lib/site-content";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

interface HomeContentProps {
  initialSkus: Item[];
}

export function HomeContent({ initialSkus }: HomeContentProps) {
  const wishlist = useWishlist();

  const featured = initialSkus.slice(0, 4);
  const popular = initialSkus.slice(4, 8);
  const overlapCard =
    initialSkus.find((sku) => sku.product_slug === HOME_COPY.testimonial.productSlug) ??
    initialSkus[8] ??
    initialSkus[0];

  return (
    <main className="-mt-20">
      <Hero
        LinkComponent={SojaLink}
        title={HOME_COPY.hero.title}
        body={HOME_COPY.hero.body}
        ctaLabel={HOME_COPY.hero.cta}
        ctaRoute={{ path: "/all-products" }}
      />

      <FeaturedProducts
        items={featured}
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
            label: "Shop hair and body",
            route: { path: "/category/hand-and-body" },
            image: images.shopHairBody,
            imageAlt: "Soja hair and body formulations",
          },
        ]}
      />

      <FeaturedProducts
        items={popular}
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
