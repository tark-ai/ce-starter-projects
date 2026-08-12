import type { Item } from "@commercengine/storefront";
import { getSdk } from "./storefront";

/**
 * Every read and write goes through one promise chain. Ordering them removes the
 * three races that come from running them concurrently: a slow initial GET
 * overwriting a completed mutation, a toggle deciding add-vs-remove from an
 * unloaded list, and an older full-list response clobbering a newer one.
 */
class WishlistStore {
  items = $state<Item[]>([]);
  count = $derived(this.items.length);
  isLoading = $state(true);

  #addListeners = new Set<() => void>();
  #loaded = false;
  #queue: Promise<unknown> = Promise.resolve();

  /** Serializes an operation onto the queue, isolating callers from each other's failures. */
  #enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.#queue.then(operation, operation);
    this.#queue = result.catch(() => undefined);
    return result;
  }

  async load() {
    if (this.#loaded) return;

    await this.#enqueue(async () => {
      if (this.#loaded) return;
      try {
        const { data, error } = await getSdk().cart.getWishlist();
        if (error) throw new Error(error.message);
        this.items = data?.products ?? [];
        // Only on success, so a transient failure doesn't block retries forever.
        this.#loaded = true;
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: surface wishlist API errors
        console.error("Failed to load favourites:", error);
      } finally {
        this.isLoading = false;
      }
    });
  }

  isInWishlist(productId: string, variantId?: string | null): boolean {
    return this.items.some((item) => {
      if (item.product_id !== productId) return false;
      return variantId ? item.variant_id === variantId : true;
    });
  }

  /** Waits for the initial list so add-vs-remove isn't decided from an empty one. */
  async toggleWishlist(productId: string, variantId?: string | null) {
    await this.load();

    if (this.isInWishlist(productId, variantId)) {
      await this.removeFromWishlist(productId, variantId);
    } else {
      await this.addToWishlist(productId, variantId);
    }
  }

  addToWishlist(productId: string, variantId?: string | null) {
    return this.#mutate("add", productId, variantId);
  }

  removeFromWishlist(productId: string, variantId?: string | null) {
    return this.#mutate("remove", productId, variantId);
  }

  #mutate(action: "add" | "remove", productId: string, variantId?: string | null) {
    return this.#enqueue(async () => {
      const body = { product_id: productId, variant_id: variantId ?? null };
      try {
        const { data, error } =
          action === "add"
            ? await getSdk().cart.addToWishlist(body)
            : await getSdk().cart.removeFromWishlist(body);
        if (error) throw new Error(error.message);

        this.items = data?.products ?? this.items;
        if (action === "add") {
          for (const listener of this.#addListeners) listener();
        }
      } catch (error) {
        // biome-ignore lint/suspicious/noConsole: surface wishlist API errors
        console.error(
          action === "add" ? "Failed to save to favourites:" : "Failed to remove from favourites:",
          error
        );
      }
    });
  }

  onAdd(listener: () => void): () => void {
    this.#addListeners.add(listener);
    return () => this.#addListeners.delete(listener);
  }
}

export const wishlist = new WishlistStore();
