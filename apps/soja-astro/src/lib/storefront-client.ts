import { getCheckout, initCheckout } from "@commercengine/checkout";
import { Environment } from "@commercengine/storefront";
import { createAstroStorefront } from "@commercengine/storefront/astro";

const useStaging = import.meta.env.PUBLIC_CE_ENV === "staging" || !import.meta.env.PUBLIC_CE_ENV;

const storefront = createAstroStorefront({
  storeId: import.meta.env.PUBLIC_STORE_ID ?? "",
  apiKey: import.meta.env.PUBLIC_API_KEY ?? "",
  environment: useStaging ? Environment.Staging : Environment.Production,
  tokenStorageOptions: { prefix: "soja_" },
  onTokensUpdated: (accessToken, refreshToken) => {
    getCheckout().updateTokens(accessToken, refreshToken);
  },
});

// Lazy: clientStorefront() throws during SSR, and hooks only reach for it inside
// queryFn callbacks, which run on the client.
let clientSdk: ReturnType<typeof storefront.clientStorefront> | null = null;

export function getSdk() {
  if (!clientSdk) clientSdk = storefront.clientStorefront();
  return clientSdk;
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

/**
 * Readiness gate for session-bound calls. getSdk() returns a usable SDK before
 * bootstrap() has created a session, so the first wishlist read can race it.
 * A failed bootstrap is swallowed so the request still proceeds on the SDK's
 * own on-demand session path rather than being blocked outright.
 */
export async function whenStorefrontReady(): Promise<void> {
  try {
    await initStorefront();
  } catch {
    // Fall through to the on-demand session path.
  }
}
