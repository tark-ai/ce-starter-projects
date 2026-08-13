import type { Item } from "@commercengine/storefront";
import { getSdk, onSessionChange } from "./storefront";

/**
 * Every read and write goes through one promise chain, so each operation sees the
 * committed result of the one before it. That ordering is what makes the toggle
 * decision safe: choosing add-vs-remove from an unordered snapshot lets two rapid
 * clicks pick the same branch twice.
 */
class WishlistStore {
  items = $state<Item[]>([]);
  count = $derived(this.items.length);
  isLoading = $state(true);

  #addListeners = new Set<() => void>();
  #loaded = false;
  #queue: Promise<unknown> = Promise.resolve();
  #generation = 0;

  /** Serializes an operation onto the queue, isolating callers from each other's failures. */
  #enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.#queue.then(operation, operation);
    this.#queue = result.catch(() => undefined);
    return result;
  }

  reset() {
    this.#generation += 1;
    this.items = [];
    this.#loaded = false;
    this.isLoading = true;
    void this.load();
  }

  /** Resolves to whether the list is known; a failed read leaves it unknown. */
  load(): Promise<boolean> {
    if (this.#loaded) return Promise.resolve(true);
    return this.#enqueue(() => this.#read());
  }

  async #read(): Promise<boolean> {
    if (this.#loaded) return true;
    const generation = this.#generation;

    try {
      const { data, error } = await getSdk().cart.getWishlist();
      if (error) throw new Error(error.message);
      if (generation !== this.#generation) return false;
      this.items = data?.products ?? [];
      // Only on success, so a transient failure doesn't block retries forever.
      this.#loaded = true;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: surface wishlist API errors
      console.error("Failed to load favourites:", error);
    } finally {
      if (generation === this.#generation) this.isLoading = false;
    }

    return this.#loaded;
  }

  isInWishlist(productId: string, variantId?: string | null): boolean {
    return this.items.some((item) => {
      if (item.product_id !== productId) return false;
      return variantId ? item.variant_id === variantId : true;
    });
  }

  toggleWishlist(productId: string, variantId?: string | null) {
    const generation = this.#generation;
    return this.#enqueue(async () => {
      // Guessing the direction against an unknown list would send an add for an
      // item that is already saved, leaving no way to remove it.
      if (!(await this.#read())) {
        if (generation !== this.#generation) return;
        // biome-ignore lint/suspicious/noConsole: surface wishlist API errors
        console.error("Cannot update favourites: the list could not be loaded.");
        return;
      }

      await this.#mutate(
        generation,
        this.isInWishlist(productId, variantId) ? "remove" : "add",
        productId,
        variantId
      );
    });
  }

  addToWishlist(productId: string, variantId?: string | null) {
    const generation = this.#generation;
    return this.#enqueue(() => this.#mutate(generation, "add", productId, variantId));
  }

  removeFromWishlist(productId: string, variantId?: string | null) {
    const generation = this.#generation;
    return this.#enqueue(() => this.#mutate(generation, "remove", productId, variantId));
  }

  async #mutate(
    generation: number,
    action: "add" | "remove",
    productId: string,
    variantId?: string | null
  ) {
    if (generation !== this.#generation) return;
    const body = { product_id: productId, variant_id: variantId ?? null };

    try {
      const { data, error } =
        action === "add"
          ? await getSdk().cart.addToWishlist(body)
          : await getSdk().cart.removeFromWishlist(body);
      if (error) throw new Error(error.message);
      if (generation !== this.#generation) return;

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
  }

  onAdd(listener: () => void): () => void {
    this.#addListeners.add(listener);
    return () => this.#addListeners.delete(listener);
  }
}

export const wishlist = new WishlistStore();

onSessionChange(() => wishlist.reset());
