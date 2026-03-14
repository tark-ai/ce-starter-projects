import type { Item } from "@commercengine/storefront";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { serverStorefront } from "@/lib/storefront.server";

function throwWishlistError(message: string, status: number): never {
  setResponseStatus(status);
  throw new Error(message);
}

export const fetchWishlist = createServerFn({ method: "GET" }).handler(async () => {
  const sdk = serverStorefront();
  const { data, error } = await sdk.cart.getWishlist();
  if (error) throwWishlistError(error.message ?? "Failed to load wishlist.", 400);

  return data ?? { products: [] as Item[] };
});

export const addToWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; variantId?: string | null }) => d)
  .handler(async ({ data }) => {
    const sdk = serverStorefront();
    const { data: result, error } = await sdk.cart.addToWishlist({
      product_id: data.productId,
      variant_id: data.variantId ?? null,
    });
    if (error) {
      throwWishlistError(error.message ?? "Failed to add item to wishlist.", 400);
    }

    return result;
  });

export const removeFromWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; variantId?: string | null }) => d)
  .handler(async ({ data }) => {
    const sdk = serverStorefront();
    const { data: result, error } = await sdk.cart.removeFromWishlist({
      product_id: data.productId,
      variant_id: data.variantId ?? null,
    });
    if (error) {
      throwWishlistError(error.message ?? "Failed to remove item from wishlist.", 400);
    }

    return result;
  });
