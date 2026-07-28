"use client";

import { ProductSection as SharedProductSection } from "@ce/little-things-shared/category";
import type { LittleThingsRoute } from "@ce/little-things-shared/lib/routing";
import type { Item } from "@commercengine/storefront";
import { LittleThingsLink } from "@/lib/little-things-routing";
import { useWishlist } from "@/lib/wishlist";

interface ProductSectionProps {
  title: string;
  items: Item[];
  description?: string;
  seeAllRoute?: LittleThingsRoute;
  seeAllLabel?: string;
}

const ProductSection = ({
  title,
  items,
  description,
  seeAllRoute,
  seeAllLabel,
}: ProductSectionProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <SharedProductSection
      title={title}
      items={items}
      description={description}
      seeAllRoute={seeAllRoute}
      seeAllLabel={seeAllLabel}
      LinkComponent={LittleThingsLink}
      isInWishlist={isInWishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default ProductSection;
