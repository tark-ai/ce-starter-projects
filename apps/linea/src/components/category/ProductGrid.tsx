import { ProductGrid as SharedProductGrid } from "@ce/linea-shared/category";
import type { Item, Pagination as PaginationType } from "@commercengine/storefront";
import { LineaLink } from "@/lib/linea-routing";
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
      LinkComponent={LineaLink}
      isInWishlist={isInWishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default ProductGrid;
