import { getCheckout, initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { BrowserTokenStorage, createStorefront, Environment } from "@commercengine/storefront";

const tokenStorage = new BrowserTokenStorage("linea_");

/** Use staging when VITE_CE_ENV=staging (e.g. Vercel Preview) or when not production build. */
const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;

const storefront = createStorefront({
  storeId: import.meta.env.VITE_STORE_ID,
  environment: useStaging ? Environment.Staging : Environment.Production,
  apiKey: import.meta.env.VITE_API_KEY,
  session: {
    tokenStorage,
    onTokensUpdated: (accessToken, refreshToken) => {
      // SDK -> checkout: keep checkout in sync when SDK tokens change
      getCheckout().updateTokens(accessToken, refreshToken);
    },
  },
});

export const sdk = storefront.session();

export async function initStorefront() {
  // 1. Ensure an anonymous/session token exists — SDK is the token owner
  const accessToken = await sdk.ensureAccessToken();
  const refreshToken = await tokenStorage.getRefreshToken();

  // 2. Init hosted checkout with authMode: "provided" + two-way sync
  initCheckout({
    storeId: import.meta.env.VITE_STORE_ID,
    apiKey: import.meta.env.VITE_API_KEY,
    environment: useStaging ? "staging" : "production",
    authMode: "provided",
    accessToken: accessToken ?? undefined,
    refreshToken: refreshToken ?? undefined,
    onTokensUpdated: ({ accessToken, refreshToken }) => {
      // checkout -> SDK: keep SDK in sync when checkout tokens change
      void sdk.setTokens(accessToken, refreshToken);
    },
  });
}

export { destroyCheckout };
