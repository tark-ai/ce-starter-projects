import { ProductCarousel as SharedProductCarousel } from "@ce/linea-shared/content";
import { useListSkus, useSimilarProducts } from "@/lib/hooks";
import { LineaLink } from "@/lib/linea-routing";
import { useWishlist } from "@/lib/wishlist";

interface ProductCarouselProps {
  productId?: string;
}

const ProductCarousel = ({ productId }: ProductCarouselProps) => {
  const similar = useSimilarProducts(productId ?? "");
  const fallback = useListSkus({ limit: 6, enabled: !productId });
  const items = productId ? similar.items : fallback.skus;
  const isLoading = productId ? similar.isLoading : fallback.isLoading;
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
