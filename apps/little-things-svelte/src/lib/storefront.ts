import { Environment } from "@commercengine/storefront";
import { createSvelteKitStorefront } from "@commercengine/storefront/sveltekit";
import { browser } from "$app/environment";
import { PUBLIC_API_KEY, PUBLIC_CE_ENV, PUBLIC_STORE_ID } from "$env/static/public";

const useStaging = PUBLIC_CE_ENV === "staging" || !PUBLIC_CE_ENV;

export const storefront = createSvelteKitStorefront({
  storeId: PUBLIC_STORE_ID ?? "",
  apiKey: PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "little_" },
  onTokensUpdated: (accessToken, refreshToken) => {
    // `@commercengine/checkout` is a browser-only integration; keep it out of
    // the server bundle by importing it dynamically inside this client-only
    // callback.
    if (!browser) return;
    import("@commercengine/checkout").then(({ getCheckout }) => {
      getCheckout().updateTokens(accessToken, refreshToken);
    });
  },
});

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

    // Browser-only checkout integration; imported dynamically so it never
    // lands in the server bundle during SSR/prerender.
    if (!browser) return;
    const { initCheckout } = await import("@commercengine/checkout");
    initCheckout({
      storeId: PUBLIC_STORE_ID ?? "",
      apiKey: PUBLIC_API_KEY ?? "",
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
