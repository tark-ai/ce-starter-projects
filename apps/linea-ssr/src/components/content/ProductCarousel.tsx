import type { Item, Product } from "@commercengine/storefront-sdk";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import WishlistButton from "@/components/WishlistButton";
import { formatPrice } from "@/lib/format";
import { useProducts, useSimilarProducts } from "@/lib/hooks";
import { useWishlist } from "@/lib/wishlist";

interface ProductCarouselProps {
  productId?: string;
  serverProducts?: Product[];
}

function isItem(p: Product | Item): p is Item {
  return "product_id" in p;
}

function getDisplayProps(p: Product | Item) {
  if (isItem(p)) {
    return {
      id: p.product_id,
      name: p.product_name,
      linkParam: p.product_slug,
      images: p.images,
      categoryName: p.categories?.[0]?.name,
      price: p.pricing.selling_price,
      currency: p.pricing.currency,
    };
  }
  return {
    id: p.id,
    name: p.name,
    linkParam: p.slug,
    images: p.images,
    categoryName: p.categories?.[0]?.name,
    price: p.pricing.selling_price,
    currency: p.pricing.currency,
  };
}

const ProductCarousel = ({ productId, serverProducts }: ProductCarouselProps) => {
  const similar = useSimilarProducts(productId ?? "");
  const fallback = useProducts({ limit: 6, enabled: !productId && !serverProducts?.length });
  const items: (Product | Item)[] = productId
    ? similar.items
    : serverProducts?.length
      ? serverProducts
      : fallback.products;
  const isLoading = productId ? similar.isLoading : !serverProducts?.length && fallback.isLoading;
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (isLoading) {
    const skeletonIds = ["c1", "c2", "c3", "c4"];
    return (
      <section className="w-full mb-16 px-6">
        <div className="flex gap-4">
          {skeletonIds.map((id) => (
            <div key={id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 shrink-0">
              <div className="aspect-square bg-muted/20 animate-pulse mb-3" />
              <div className="h-4 w-20 bg-muted/20 animate-pulse mb-1" />
              <div className="h-4 w-32 bg-muted/20 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mb-16 px-6">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="">
          {items.map((product) => {
            const d = getDisplayProps(product);
            return (
              <CarouselItem key={d.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4">
                <Link to="/product/$slug" params={{ slug: d.linkParam }}>
                  <Card className="border-none shadow-none bg-transparent group">
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                        <Image
                          src={d.images?.[0]?.url_standard ?? ""}
                          alt={d.images?.[0]?.alternate_text || d.name}
                          layout="fullWidth"
                          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                        />
                        <Image
                          src={d.images?.[1]?.url_standard || d.images?.[0]?.url_standard || ""}
                          alt={`${d.name} alternate`}
                          layout="fullWidth"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/[0.03]" />
                        <WishlistButton
                          active={isInWishlist(d.id)}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(d.id);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-light text-foreground">{d.categoryName}</p>
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-foreground">{d.name}</h3>
                          <p className="text-sm font-light text-foreground">
                            {formatPrice(d.price, d.currency)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
