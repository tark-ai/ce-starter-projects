import { FeaturedProducts as SharedFeaturedProducts } from "@ce/little-things-shared/content";
import type { Item } from "@commercengine/storefront";
import { LittleThingsLink } from "@/lib/little-things-routing";
import { useWishlist } from "@/lib/wishlist";

interface FeaturedProductsProps {
  items: Item[];
  isLoading?: boolean;
}

const FeaturedProducts = ({ items, isLoading }: FeaturedProductsProps) => {
  // isInWishlist/onToggleWishlist are required by the shared component's props, so
  // they must be passed even though the current shared implementation doesn't use
  // them. `title` was optional and ignored — dropped so the wrapper API isn't
  // misleading.
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <SharedFeaturedProducts
      items={items}
      isLoading={isLoading}
      LinkComponent={LittleThingsLink}
      isInWishlist={isInWishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default FeaturedProducts;
