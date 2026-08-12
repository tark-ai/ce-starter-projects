import { getCheckout, initCheckout } from "@commercengine/checkout";
import { destroyCheckout } from "@commercengine/checkout/react";
import { BrowserTokenStorage, createStorefront, Environment } from "@commercengine/storefront";

const tokenStorage = new BrowserTokenStorage("soja_");

const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;

const storefront = createStorefront({
  storeId: import.meta.env.VITE_STORE_ID,
  environment: useStaging ? Environment.Staging : Environment.Production,
  apiKey: import.meta.env.VITE_API_KEY,
  session: {
    tokenStorage,
    onTokensUpdated: (accessToken, refreshToken) => {
      getCheckout().updateTokens(accessToken, refreshToken);
    },
  },
});

export const sdk = storefront.session();

export async function initStorefront() {
  const accessToken = await sdk.ensureAccessToken();
  const refreshToken = await tokenStorage.getRefreshToken();

  initCheckout({
    storeId: import.meta.env.VITE_STORE_ID,
    apiKey: import.meta.env.VITE_API_KEY,
    environment: useStaging ? "staging" : "production",
    authMode: "provided",
    accessToken: accessToken ?? undefined,
    refreshToken: refreshToken ?? undefined,
    onTokensUpdated: ({ accessToken, refreshToken }) => {
      void sdk.setTokens(accessToken, refreshToken);
    },
  });
}

export { destroyCheckout };
