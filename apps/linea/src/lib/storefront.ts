import { getCheckout, initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import StorefrontSDK, { BrowserTokenStorage, Environment } from "@commercengine/storefront-sdk";

const tokenStorage = new BrowserTokenStorage("linea_");

/** Use staging when VITE_CE_ENV=staging (e.g. Vercel Preview) or when not production build. */
const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;

export const sdk = new StorefrontSDK({
  storeId: import.meta.env.VITE_STORE_ID,
  environment: useStaging ? Environment.Staging : Environment.Production,
  apiKey: import.meta.env.VITE_API_KEY,
  tokenStorage,
  onTokensUpdated: (accessToken, refreshToken) => {
    // SDK -> checkout: keep checkout in sync when SDK tokens change
    getCheckout().updateTokens(accessToken, refreshToken);
  },
});

export async function initStorefront() {
  // 1. Anonymous auth — SDK is the token owner
  const { error } = await sdk.auth.getAnonymousToken();
  if (error) {
    throw new Error(`Anonymous auth failed: ${error.message}`);
  }

  // 2. Read tokens to pass to checkout
  const accessToken = await tokenStorage.getAccessToken();
  const refreshToken = await tokenStorage.getRefreshToken();

  // 3. Init hosted checkout with authMode: "provided" + two-way sync
  initCheckout({
    storeId: import.meta.env.VITE_STORE_ID,
    apiKey: import.meta.env.VITE_API_KEY,
    environment: useStaging ? "staging" : "production",
    authMode: "provided",
    accessToken: accessToken ?? undefined,
    refreshToken: refreshToken ?? undefined,
    onTokensUpdated: ({ accessToken, refreshToken }) => {
      // checkout -> SDK: keep SDK in sync when checkout tokens change
      sdk.setTokens(accessToken, refreshToken);
    },
  });
}

export { destroyCheckout };
