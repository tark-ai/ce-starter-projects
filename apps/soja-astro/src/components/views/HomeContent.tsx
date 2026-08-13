import { BrandPillars, FeaturedProducts, Hero, Testimonial } from "@ce/soja-shared/content";
import { images } from "@ce/soja-ui/lib/images";
import type { Item } from "@commercengine/storefront";
import { HOME_COPY } from "@/lib/site-content";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";
import Providers from "../Providers";

interface HomeContentProps {
  initialSkus: Item[];
}

export default function HomeContent(props: HomeContentProps) {
  return (
    <Providers>
      <HomeContentInner {...props} />
    </Providers>
  );
}

function HomeContentInner({ initialSkus }: HomeContentProps) {
  const wishlist = useWishlist();

  const overlapCard =
    initialSkus.find((sku) => sku.product_slug === HOME_COPY.testimonial.productSlug) ??
    initialSkus[8] ??
    initialSkus[0];

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
        items={initialSkus.slice(0, 4)}
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
        items={initialSkus.slice(4, 8)}
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
