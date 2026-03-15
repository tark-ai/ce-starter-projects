"use client";

import { ProductCarousel as SharedProductCarousel } from "@ce/linea-shared/content";
import type { Item } from "@commercengine/storefront";
import { useListSkus, useSimilarProducts } from "@/lib/hooks";
import { LineaLink } from "@/lib/linea-routing";
import { useWishlist } from "@/lib/wishlist";

interface ProductCarouselProps {
  productId?: string;
  serverProducts?: Item[];
}

const ProductCarousel = ({ productId, serverProducts }: ProductCarouselProps) => {
  const hasServerData = serverProducts && serverProducts.length > 0;
  const similar = useSimilarProducts(productId && !hasServerData ? productId : "");
  const fallback = useListSkus({ limit: 6, enabled: !productId && !hasServerData });

  const items = hasServerData ? serverProducts : productId ? similar.items : fallback.skus;
  const isLoading = hasServerData ? false : productId ? similar.isLoading : fallback.isLoading;
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <SharedProductCarousel
      items={items}
      isLoading={isLoading}
      LinkComponent={LineaLink}
      isInWishlist={isInWishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default ProductCarousel;
