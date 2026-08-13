import { getCheckout, subscribeToCheckout } from "@commercengine/checkout";

class CheckoutStore {
  cartCount = $state(0);

  #unsubscribe: (() => void) | null = null;

  init() {
    if (this.#unsubscribe) return;

    this.cartCount = getCheckout().cartCount;
    this.#unsubscribe = subscribeToCheckout(
      (state) => state.cartCount,
      (count) => {
        this.cartCount = count;
      }
    );
  }

  openCart() {
    getCheckout().openCart();
  }

  addToCart(productId: string, variantId: string | null, quantity: number) {
    getCheckout().addToCart(productId, variantId, quantity);
  }

  destroy() {
    this.#unsubscribe?.();
    this.#unsubscribe = null;
  }
}

export const checkout = new CheckoutStore();
