import { getCheckout, initCheckout } from "@commercengine/checkout";
import { Environment } from "@commercengine/storefront";
import { createAstroStorefront } from "@commercengine/storefront/astro";

const useStaging = import.meta.env.PUBLIC_CE_ENV === "staging" || !import.meta.env.PUBLIC_CE_ENV;

const storefront = createAstroStorefront({
  storeId: import.meta.env.PUBLIC_STORE_ID ?? "",
  apiKey: import.meta.env.PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "little_" },
  onTokensUpdated: (accessToken, refreshToken) => {
    getCheckout().updateTokens(accessToken, refreshToken);
  },
});

// Lazy — clientStorefront() throws during SSR, but hooks only call getSdk()
// inside queryFn callbacks which only execute on the client.
let _sdk: ReturnType<typeof storefront.clientStorefront> | null = null;

export function getSdk() {
  if (!_sdk) {
    _sdk = storefront.clientStorefront();
  }
  return _sdk;
}

let initPromise: Promise<void> | null = null;

export function initStorefront() {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    await storefront.bootstrap();

    const sdk = getSdk();
    const accessToken = await sdk.getAccessToken();
    const refreshToken = await sdk.session.peekRefreshToken();

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
