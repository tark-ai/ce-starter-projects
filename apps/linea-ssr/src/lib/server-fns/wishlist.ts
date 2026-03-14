import type { Item, SessionStorefrontSDK } from "@commercengine/storefront";
import { createServerFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { serverStorefront } from "@/lib/storefront.server";

function throwWishlistError(message: string, status: number): never {
  setResponseStatus(status);
  throw new Error(message);
}

async function getWishlistSessionStorefront(): Promise<SessionStorefrontSDK> {
  const sdk = serverStorefront();
  await sdk.ensureAccessToken();
  return sdk;
}

export const fetchWishlist = createServerFn({ method: "GET" }).handler(async () => {
  const sdk = await getWishlistSessionStorefront();
  const userId = await sdk.getUserId();

  if (!userId) {
    setResponseStatus(200);
    return { products: [] as Item[] };
  }

  const { data, error } = await sdk.cart.getWishlist({ user_id: userId });
  if (error) throwWishlistError(error.message ?? "Failed to load wishlist.", 400);

  return data ?? { products: [] as Item[] };
});

export const addToWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; variantId?: string | null }) => d)
  .handler(async ({ data }) => {
    const sdk = await getWishlistSessionStorefront();
    const userId = await sdk.getUserId();
    if (!userId) throwWishlistError("Your session is not ready yet. Please try again.", 401);

    const { data: result, error } = await sdk.cart.addToWishlist(
      { user_id: userId },
      { product_id: data.productId, variant_id: data.variantId ?? null }
    );
    if (error) {
      throwWishlistError(error.message ?? "Failed to add item to wishlist.", 400);
    }

    return result;
  });

export const removeFromWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; variantId?: string | null }) => d)
  .handler(async ({ data }) => {
    const sdk = await getWishlistSessionStorefront();
    const userId = await sdk.getUserId();
    if (!userId) throwWishlistError("Your session is not ready yet. Please try again.", 401);

    const { data: result, error } = await sdk.cart.removeFromWishlist(
      { user_id: userId },
      { product_id: data.productId, variant_id: data.variantId ?? null }
    );
    if (error) {
      throwWishlistError(error.message ?? "Failed to remove item from wishlist.", 400);
    }

    return result;
  });
