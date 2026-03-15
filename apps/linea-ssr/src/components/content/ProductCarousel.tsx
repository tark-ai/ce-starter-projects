import { ProductCarousel as SharedProductCarousel } from "@ce/linea-shared/content";
import type { Item } from "@commercengine/storefront";
import { useSimilarProducts } from "@/lib/hooks";
import { LineaLink } from "@/lib/linea-routing";
import { useWishlist } from "@/lib/wishlist";

interface ProductCarouselProps {
  productId?: string;
  serverProducts?: Item[];
}

const ProductCarousel = ({ productId, serverProducts }: ProductCarouselProps) => {
  const similar = useSimilarProducts(productId ?? "");
  const items = productId ? similar.items : (serverProducts ?? []);
  const isLoading = productId ? similar.isLoading : false;
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
