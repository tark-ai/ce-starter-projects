import type { Item } from "@commercengine/storefront";
import { getSdk } from "./storefront";

class WishlistStore {
  items = $state<Item[]>([]);
  count = $derived(this.items.length);
  isLoading = $state(true);

  #addListeners = new Set<() => void>();
  #initialized = false;
  // Monotonic id stamped when a mutation STARTS.
  #opSeq = 0;
  // Seq of the newest mutation whose SUCCESS was applied. Only a success with a
  // seq >= this may commit, so a later failure can't discard an earlier success.
  #appliedSeq = 0;

  async load() {
    if (this.#initialized) return;
    this.isLoading = true;
    try {
      const { data, error } = await getSdk().cart.getWishlist();
      if (error) throw new Error(error.message);
      this.items = data?.products ?? [];
      // Only on success, so a transient failure doesn't block retries forever.
      this.#initialized = true;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: surface wishlist API errors
      console.error("Failed to load favourites:", error);
    } finally {
      this.isLoading = false;
    }
  }

  isInWishlist(productId: string, variantId?: string | null): boolean {
    return this.items.some((item) => {
      if (item.product_id !== productId) return false;
      return variantId ? item.variant_id === variantId : true;
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
    const seq = ++this.#opSeq;
    try {
      const { data, error } = await getSdk().cart.addToWishlist({
        product_id: productId,
        variant_id: variantId ?? null,
      });
      if (error) throw new Error(error.message);
      if (seq < this.#appliedSeq) return;
      this.#appliedSeq = seq;
      this.items = data?.products ?? this.items;
      for (const listener of this.#addListeners) listener();
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: surface wishlist API errors
      console.error("Failed to save to favourites:", error);
    }
  }

  async removeFromWishlist(productId: string, variantId?: string | null) {
    const seq = ++this.#opSeq;
    try {
      const { data, error } = await getSdk().cart.removeFromWishlist({
        product_id: productId,
        variant_id: variantId ?? null,
      });
      if (error) throw new Error(error.message);
      if (seq < this.#appliedSeq) return;
      this.#appliedSeq = seq;
      this.items = data?.products ?? this.items;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: surface wishlist API errors
      console.error("Failed to remove from favourites:", error);
    }
  }

  onAdd(listener: () => void): () => void {
    this.#addListeners.add(listener);
    return () => this.#addListeners.delete(listener);
  }
}

export const wishlist = new WishlistStore();
