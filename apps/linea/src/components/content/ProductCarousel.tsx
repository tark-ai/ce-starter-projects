import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { formatPrice } from "@/lib/format";
import { useProducts } from "@/lib/hooks";

const ProductCarousel = () => {
  const { products, isLoading } = useProducts({ limit: 6 });

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
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <Link to={`/product/${product.slug}`}>
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                      <img
                        src={product.images?.[0]?.url_standard}
                        alt={product.images?.[0]?.alternate_text || product.name}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                      />
                      <img
                        src={product.images?.[1]?.url_standard || product.images?.[0]?.url_standard}
                        alt={`${product.name} alternate`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/[0.03]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-light text-foreground">
                        {product.categories?.[0]?.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
                        <p className="text-sm font-light text-foreground">
                          {formatPrice(product.pricing.selling_price, product.pricing.currency)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
