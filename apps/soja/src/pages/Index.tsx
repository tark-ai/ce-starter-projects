import { BrandPillars, FeaturedProducts, Hero, Testimonial } from "@ce/soja-shared/content";
import { images } from "@ce/soja-ui/lib/images";
import { Layout } from "@/components/Layout";
import { useListSkus } from "@/lib/hooks";
import { HOME_COPY } from "@/lib/site-content";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

const Index = () => {
  const { skus, isLoading } = useListSkus({ limit: 24 });
  const wishlist = useWishlist();

  const featured = skus.slice(0, 4);
  const popular = skus.slice(4, 8);
  const overlapCard =
    skus.find((sku) => sku.product_slug === HOME_COPY.testimonial.productSlug) ??
    skus[8] ??
    skus[0];

  return (
    <Layout overHero>
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
        isLoading={isLoading}
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
        items={popular}
        LinkComponent={SojaLink}
        isLoading={isLoading}
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
    </Layout>
  );
};

export default Index;
