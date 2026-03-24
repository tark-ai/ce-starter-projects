import type { Item } from "@commercengine/storefront";
import { getSdk } from "./storefront";

type OnAddListener = () => void;

class WishlistStore {
  items = $state<Item[]>([]);
  count = $derived(this.items.length);
  isLoading = $state(true);

  #addListeners = new Set<OnAddListener>();
  #initialized = false;

  async load() {
    if (this.#initialized) return;
    this.#initialized = true;
    this.isLoading = true;
    try {
      const { data, error } = await getSdk().cart.getWishlist();
      if (error) throw new Error(error.message);
      this.items = data?.products ?? [];
    } catch (e) {
      console.error("Failed to load wishlist:", e);
    } finally {
      this.isLoading = false;
    }
  }

  isInWishlist(productId: string, variantId?: string | null): boolean {
    return this.items.some((item) => {
      if (item.product_id !== productId) return false;
      if (!variantId) return true;
      return item.variant_id === variantId;
    });
  }

  async toggleWishlist(productId: string, variantId?: string | null) {
    if (this.isInWishlist(productId, variantId)) {
      await this.removeFromWishlist(productId, variantId);
    } else {
      await this.addToWishlist(productId, variantId);
    }
  }

  async addToWishlist(productId: string, variantId?: string | null) {
    try {
      const { data, error } = await getSdk().cart.addToWishlist({
        product_id: productId,
        variant_id: variantId ?? null,
      });
      if (error) throw new Error(error.message);
      this.items = data?.products ?? this.items;
      for (const fn of this.#addListeners) fn();
    } catch (e) {
      console.error("Failed to add to wishlist:", e);
    }
  }

  async removeFromWishlist(productId: string, variantId?: string | null) {
    try {
      const { data, error } = await getSdk().cart.removeFromWishlist({
        product_id: productId,
        variant_id: variantId ?? null,
      });
      if (error) throw new Error(error.message);
      this.items = data?.products ?? this.items;
    } catch (e) {
      console.error("Failed to remove from wishlist:", e);
    }
  }

  onAdd(listener: OnAddListener): () => void {
    this.#addListeners.add(listener);
    return () => this.#addListeners.delete(listener);
  }
}

export const wishlist = new WishlistStore();
