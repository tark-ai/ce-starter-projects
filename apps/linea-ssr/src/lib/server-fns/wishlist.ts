import type { Item, SessionStorefrontSDK } from "@commercengine/storefront";
import { createServerFn } from "@tanstack/react-start";
import { storefront } from "@/lib/storefront";

async function getWishlistSessionStorefront(): Promise<SessionStorefrontSDK> {
  const sdk = await storefront.serverStorefront();
  await sdk.ensureAccessToken();
  return sdk;
}

export const fetchWishlist = createServerFn({ method: "GET" }).handler(async () => {
  const sdk = await getWishlistSessionStorefront();
  const userId = await sdk.getUserId();

  if (!userId) {
    return { products: [] as Item[] };
  }

  const { data, error } = await sdk.cart.getWishlist({ user_id: userId });
  if (error) throw new Error(error.message);

  return data ?? { products: [] as Item[] };
});

export const addToWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; variantId?: string | null }) => d)
  .handler(async ({ data }) => {
    const sdk = await getWishlistSessionStorefront();
    const userId = await sdk.getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data: result, error } = await sdk.cart.addToWishlist(
      { user_id: userId },
      { product_id: data.productId, variant_id: data.variantId ?? null }
    );
    if (error) throw new Error(error.message);

    return result;
  });

export const removeFromWishlist = createServerFn({ method: "POST" })
  .inputValidator((d: { productId: string; variantId?: string | null }) => d)
  .handler(async ({ data }) => {
    const sdk = await getWishlistSessionStorefront();
    const userId = await sdk.getUserId();
    if (!userId) throw new Error("Not authenticated");

    const { data: result, error } = await sdk.cart.removeFromWishlist(
      { user_id: userId },
      { product_id: data.productId, variant_id: data.variantId ?? null }
    );
    if (error) throw new Error(error.message);

    return result;
  });
