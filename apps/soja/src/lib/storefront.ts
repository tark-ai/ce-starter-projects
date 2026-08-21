import { createSessionChangeNotifier } from "@ce/soja-shared/lib/session-change";
import { getCheckout, initCheckout } from "@commercengine/checkout";
import { destroyCheckout as destroyCheckoutSingleton } from "@commercengine/checkout/react";
import { BrowserTokenStorage, createStorefront, Environment } from "@commercengine/storefront";

const tokenStorage = new BrowserTokenStorage("soja_");
const sessionChange = createSessionChangeNotifier();
void tokenStorage.getAccessToken().then(sessionChange.update, () => undefined);

const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;

export const storefront = createStorefront({
  storeId: import.meta.env.VITE_STORE_ID,
  environment: useStaging ? Environment.Staging : Environment.Production,
  apiKey: import.meta.env.VITE_API_KEY,
  session: {
    tokenStorage,
    onTokensUpdated: (accessToken, refreshToken) => {
      getCheckout().updateTokens(accessToken, refreshToken);
      sessionChange.update(accessToken);
    },
    onTokensCleared: () => sessionChange.update(null),
  },
});

export const sdk = storefront.session();

export const onSessionChange = sessionChange.subscribe;

let initPromise: Promise<void> | null = null;
// Prevent superseded attempts from initializing checkout or clearing the current memo.
let initGeneration = 0;
let initInFlight = false;

interface InitStorefrontOptions {
  force?: boolean;
}

let agentTools: AbortController | null = null;

/**
 * Registers this storefront's WebMCP tools. A no-op in browsers without WebMCP; the package
 * reports which happened through `diagnostics`. Safe to call more than once.
 */
export async function registerAgentTools(navigate: (url: string) => void) {
  const [{ registerCommerceWebMcp }, { createHostedCheckoutBridge }, { routes, site }] =
    await Promise.all([
      import("@commercengine/ai/webmcp"),
      import("@commercengine/ai/checkout"),
      import("./commerce-seo.config"),
    ]);
  agentTools?.abort();
  agentTools = await registerCommerceWebMcp({
    storefront,
    siteUrl: site.url,
    routes,
    checkout: createHostedCheckoutBridge({ getState: () => getCheckout() }),
    navigation: { navigate },
    diagnostics: import.meta.env.DEV
      ? // biome-ignore lint/suspicious/noConsole: development diagnostic
        (event) => console.info("[commerce-ai]", event.code, event.message ?? "")
      : undefined,
  });
  return agentTools;
}

export function initStorefront({ force = false }: InitStorefrontOptions = {}) {
  const supersede = force && initInFlight;
  if (initPromise && !supersede) return initPromise;

  if (supersede) initGeneration += 1;

  const generation = initGeneration;
  initInFlight = true;

  initPromise = (async () => {
    const accessToken = await sdk.ensureAccessToken();
    const refreshToken = await tokenStorage.getRefreshToken();
    if (generation !== initGeneration) return;

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
  })().then(
    () => {
      if (generation === initGeneration) initInFlight = false;
    },
    (error) => {
      if (generation === initGeneration) {
        initInFlight = false;
        initPromise = null;
      }
      throw error;
    }
  );

  return initPromise;
}

export function withTimeout(promise: Promise<void>, ms: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Storefront bootstrap timed out")), ms);
    void promise.then(resolve, reject).finally(() => clearTimeout(timer));
  });
}

const READINESS_TIMEOUT_MS = 10_000;

/**
 * Readiness gate for session-bound calls. `sdk` is callable before
 * initStorefront() has established a session, so the first wishlist read can
 * race the bootstrap. A failed bootstrap is swallowed so the request still
 * proceeds on the SDK's own on-demand session path rather than being blocked.
 */
export async function whenStorefrontReady(): Promise<void> {
  try {
    await withTimeout(initStorefront(), READINESS_TIMEOUT_MS);
  } catch {
    // Fall through to the on-demand session path.
  }
}

export function destroyCheckout() {
  // The memo describes the checkout being torn down, so it has to go with it.
  initGeneration += 1;
  initPromise = null;
  initInFlight = false;
  destroyCheckoutSingleton();
}
