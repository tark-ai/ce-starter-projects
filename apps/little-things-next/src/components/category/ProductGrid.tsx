"use client";

import { ProductGrid as SharedProductGrid } from "@ce/little-things-shared/category";
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import { LittleThingsLink } from "@/lib/little-things-routing";
import { useWishlist } from "@/lib/wishlist";

interface ProductGridProps {
  skus: Item[];
  isLoading: boolean;
  pagination: PaginationType | undefined;
  onPageChange: (page: number) => void;
}

const ProductGrid = ({ skus, isLoading, pagination, onPageChange }: ProductGridProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <SharedProductGrid
      skus={skus}
      isLoading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
      LinkComponent={LittleThingsLink}
      isInWishlist={isInWishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default ProductGrid;
