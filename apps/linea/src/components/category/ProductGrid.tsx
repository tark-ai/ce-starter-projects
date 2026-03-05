import type { Item, Pagination as PaginationType } from "@commercengine/storefront-sdk";
import { Image } from "@unpic/react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import WishlistButton from "@/components/WishlistButton";
import { formatPrice } from "@/lib/format";
import { useWishlist } from "@/lib/wishlist";
import PaginationBar from "./Pagination";

interface ProductGridProps {
  skus: Item[];
  isLoading: boolean;
  pagination: PaginationType | undefined;
  onPageChange: (page: number) => void;
}

const ProductGrid = ({ skus, isLoading, pagination, onPageChange }: ProductGridProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  if (isLoading) {
    const skeletonIds = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {skeletonIds.map((id) => (
            <div key={id}>
              <div className="aspect-square bg-muted/20 animate-pulse mb-3" />
              <div className="h-4 w-20 bg-muted/20 animate-pulse mb-1" />
              <div className="h-4 w-32 bg-muted/20 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (skus.length === 0) {
    return (
      <section className="w-full px-6 mb-16">
        <p className="text-sm font-light text-muted-foreground py-12 text-center">
          No products found.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {skus.map((item) => (
          <Link key={item.sku} to={`/product/${item.product_id}`}>
            <Card className="border-none shadow-none bg-transparent group cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                  <Image
                    src={item.images?.[0]?.url_standard ?? ""}
                    alt={item.images?.[0]?.alternate_text || item.product_name}
                    layout="fullWidth"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                  />
                  <Image
                    src={item.images?.[1]?.url_standard || item.images?.[0]?.url_standard || ""}
                    alt={`${item.product_name} alternate`}
                    layout="fullWidth"
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/[0.03]" />
                  <WishlistButton
                    active={isInWishlist(item.product_id)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(item.product_id, item.variant_id);
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-light text-foreground">{item.categories?.[0]?.name}</p>
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
        ))}
      </div>

      {pagination && pagination.total_pages > 1 && (
        <PaginationBar pagination={pagination} onPageChange={onPageChange} />
      )}
    </section>
  );
};

export default ProductGrid;
