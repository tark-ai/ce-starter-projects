import type { Item } from "@commercengine/storefront";
import { getSdk } from "./storefront";

type OnAddListener = () => void;

class WishlistStore {
  items = $state<Item[]>([]);
  count = $derived(this.items.length);
  isLoading = $state(true);

  #addListeners = new Set<OnAddListener>();
  #initialized = false;
  // Monotonic id assigned to each mutating operation when it STARTS.
  #opSeq = 0;
  // Seq of the newest operation whose SUCCESSFUL result has been applied. Only a
  // successful response with a seq >= this may commit, so a later request that
  // FAILS can't discard an earlier successful add/remove. Failures never advance
  // this marker.
  #appliedSeq = 0;

  async load() {
    if (this.#initialized) return;
    this.isLoading = true;
    try {
      const { data, error } = await getSdk().cart.getWishlist();
      if (error) throw new Error(error.message);
      this.items = data?.products ?? [];
      // Only mark initialized on success so a transient failure doesn't
      // permanently block retries.
      this.#initialized = true;
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: surface wishlist API errors for debugging
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
    const seq = ++this.#opSeq;
    try {
      const { data, error } = await getSdk().cart.addToWishlist({
        product_id: productId,
        variant_id: variantId ?? null,
      });
      if (error) throw new Error(error.message);
      // Only commit if no newer operation has already applied a successful
      // result; a later request that errors must not invalidate this one.
      if (seq < this.#appliedSeq) return;
      this.#appliedSeq = seq;
      this.items = data?.products ?? this.items;
      for (const fn of this.#addListeners) fn();
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: surface wishlist API errors for debugging
      console.error("Failed to add to wishlist:", e);
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
      // Only commit if no newer operation has already applied a successful
      // result; a later request that errors must not invalidate this one.
      if (seq < this.#appliedSeq) return;
      this.#appliedSeq = seq;
      this.items = data?.products ?? this.items;
    } catch (e) {
      // biome-ignore lint/suspicious/noConsole: surface wishlist API errors for debugging
      console.error("Failed to remove from wishlist:", e);
    }
  }

  onAdd(listener: OnAddListener): () => void {
    this.#addListeners.add(listener);
    return () => this.#addListeners.delete(listener);
  }
}

export const wishlist = new WishlistStore();
