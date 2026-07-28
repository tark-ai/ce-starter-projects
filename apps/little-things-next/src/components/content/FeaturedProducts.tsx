"use client";

import { FeaturedProducts as SharedFeaturedProducts } from "@ce/little-things-shared/content";
import type { Item } from "@commercengine/storefront";
import { LittleThingsLink } from "@/lib/little-things-routing";
import { useWishlist } from "@/lib/wishlist";

interface FeaturedProductsProps {
  items: Item[];
  isLoading?: boolean;
  title?: string;
}

const FeaturedProducts = ({ items, isLoading, title }: FeaturedProductsProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <SharedFeaturedProducts
      items={items}
      isLoading={isLoading}
      title={title}
      LinkComponent={LittleThingsLink}
      isInWishlist={isInWishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default FeaturedProducts;
