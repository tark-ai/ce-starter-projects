import { getCheckout, initCheckout } from "@commercengine/checkout";
import { BrowserTokenStorage, createStorefront, Environment } from "@commercengine/storefront";

const tokenStorage = new BrowserTokenStorage("linea_");

const useStaging = import.meta.env.PUBLIC_CE_ENV === "staging" || !import.meta.env.PUBLIC_CE_ENV;

const storefront = createStorefront({
  storeId: import.meta.env.PUBLIC_STORE_ID ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  apiKey: import.meta.env.PUBLIC_API_KEY ?? "",
  session: {
    tokenStorage,
    onTokensUpdated: (accessToken, refreshToken) => {
      getCheckout().updateTokens(accessToken, refreshToken);
    },
  },
});

export const sdk = storefront.session();

let initPromise: Promise<void> | null = null;

export function initStorefront() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const accessToken = await sdk.ensureAccessToken();
    const refreshToken = await tokenStorage.getRefreshToken();

    initCheckout({
      storeId: import.meta.env.PUBLIC_STORE_ID ?? "",
      apiKey: import.meta.env.PUBLIC_API_KEY ?? "",
      environment: useStaging ? "staging" : "production",
      authMode: "provided",
      accessToken: accessToken ?? undefined,
      refreshToken: refreshToken ?? undefined,
      onTokensUpdated: ({ accessToken, refreshToken }) => {
        void sdk.setTokens(accessToken, refreshToken);
      },
    });
  })().catch((error) => {
    initPromise = null;
    throw error;
  });

  return initPromise;
}
