import type { Item } from "@commercengine/storefront";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { serverStorefront } from "@/lib/storefront.server";

interface WishlistTarget {
  productId: string;
  variantId?: string | null;
}

function failWishlist(message: string | undefined, fallback: string): never {
  setResponseStatus(400);
  throw new Error(message ?? fallback);
}

export const fetchWishlist = createServerFn({ method: "GET" }).handler(async () => {
  const sdk = serverStorefront();
  const { data, error } = await sdk.cart.getWishlist();
  if (error) failWishlist(error.message, "Failed to load favourites.");

  return data ?? { products: [] as Item[] };
});

export const addToWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: WishlistTarget) => d)
  .handler(async ({ data }) => {
    const sdk = serverStorefront();
    const { data: result, error } = await sdk.cart.addToWishlist({
      product_id: data.productId,
      variant_id: data.variantId ?? null,
    });
    if (error) failWishlist(error.message, "Failed to save to favourites.");

    return result;
  });

export const removeFromWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: WishlistTarget) => d)
  .handler(async ({ data }) => {
    const sdk = serverStorefront();
    const { data: result, error } = await sdk.cart.removeFromWishlist({
      product_id: data.productId,
      variant_id: data.variantId ?? null,
    });
    if (error) failWishlist(error.message, "Failed to remove from favourites.");

    return result;
  });
