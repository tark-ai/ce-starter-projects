import type { Item } from "@commercengine/storefront";

/** Save/unsave contract injected by the app, as with `SojaLinkComponent`. */
export interface SojaWishlistControls {
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
}

/** What the header's favourites panel needs on top of the controls. */
export interface SojaWishlistPanel extends SojaWishlistControls {
  items: Item[];
  count: number;
  removeFromWishlist: (productId: string, variantId?: string | null) => void;
  /** Registers a save listener and returns its unsubscribe function. */
  registerOnAdd: (listener: () => void) => () => void;
}
