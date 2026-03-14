import type { Item } from "@commercengine/storefront";
import { Image } from "@unpic/react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import WishlistButton from "@/components/WishlistButton";
import { formatPrice } from "@/lib/format";
import { useListSkus, useSimilarProducts } from "@/lib/hooks";
import { useWishlist } from "@/lib/wishlist";

interface ProductCarouselProps {
  productId?: string;
}

const ProductCarousel = ({ productId }: ProductCarouselProps) => {
  const similar = useSimilarProducts(productId ?? "");
  const fallback = useListSkus({ limit: 6, enabled: !productId });
  const items: Item[] = productId ? similar.items : fallback.skus;
  const isLoading = productId ? similar.isLoading : fallback.isLoading;
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
          {items.map((item) => {
            return (
              <CarouselItem
                key={`${item.product_id}:${item.variant_id ?? "product"}`}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
              >
                <Link
                  to={`/product/${item.product_slug}${item.variant_slug ? `?variant=${item.variant_slug}` : ""}`}
                >
                  <Card className="border-none shadow-none bg-transparent group">
                    <CardContent className="p-0">
                      <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                        <Image
                          src={item.images?.[0]?.url_standard ?? ""}
                          alt={item.images?.[0]?.alternate_text || item.product_name}
                          layout="fullWidth"
                          className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                        />
                        <Image
                          src={
                            item.images?.[1]?.url_standard || item.images?.[0]?.url_standard || ""
                          }
                          alt={`${item.variant_name || item.product_name} alternate`}
                          layout="fullWidth"
                          className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/[0.03]" />
                        <WishlistButton
                          active={isInWishlist(item.product_id, item.variant_id)}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(item.product_id, item.variant_id);
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-light text-foreground">
                          {item.categories?.[0]?.name}
                        </p>
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-medium text-foreground">
                            {item.variant_name || item.product_name}
                          </h3>
                          <p className="text-sm font-light text-foreground">
                            {formatPrice(item.pricing.selling_price, item.pricing.currency)}
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
