import type { Item } from "@commercengine/storefront";

export interface SojaWishlistControls {
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
}

export interface SojaWishlistPanel extends SojaWishlistControls {
  items: Item[];
  count: number;
  removeFromWishlist: (productId: string, variantId?: string | null) => void;
  registerOnAdd: (listener: () => void) => () => void;
}
