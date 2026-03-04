import {
  type CookieAdapter,
  type CookieOptions,
  ServerTokenStorage,
} from "@commercengine/ssr-utils";
import StorefrontSDK, { Environment } from "@commercengine/storefront-sdk";
import { createIsomorphicFn } from "@tanstack/react-start";
import { deleteClientCookie, getClientCookie, setClientCookie } from "./cookies.client";
import { deleteServerCookie, getServerCookie, setServerCookie } from "./cookies.server";

// Cloudflare Workers/workerd doesn't send a User-Agent by default.
// The CE API requires one, so patch global fetch on the server to inject it.
if (typeof window === "undefined") {
  const _fetch = globalThis.fetch;
  globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (input instanceof Request) {
      if (!input.headers.has("User-Agent")) {
        input.headers.set("User-Agent", "linea-ssr/1.0");
      }
      return _fetch(input, init);
    }
    const headers = new Headers(init?.headers);
    if (!headers.has("User-Agent")) {
      headers.set("User-Agent", "linea-ssr/1.0");
    }
    return _fetch(input, { ...init, headers });
  };
}

/**
 * Isomorphic cookie operations using createIsomorphicFn().
 *
 * TanStack Start tree-shakes at the import level:
 * - cookies.server.ts (imports @tanstack/react-start/server) is stripped from client bundle
 * - cookies.client.ts (uses document.cookie) is stripped from server bundle
 */
const getCookieValue = createIsomorphicFn()
  .server((name: string) => getServerCookie(name))
  .client((name: string) => getClientCookie(name));

const setCookieValue = createIsomorphicFn()
  .server((name: string, value: string, options?: CookieOptions) =>
    setServerCookie(name, value, options)
  )
  .client((name: string, value: string, options?: CookieOptions) =>
    setClientCookie(name, value, options)
  );

const deleteCookieValue = createIsomorphicFn()
  .server((name: string) => deleteServerCookie(name))
  .client((name: string) => deleteClientCookie(name));

const cookieAdapter: CookieAdapter = {
  get: (name: string) => getCookieValue(name),
  set: (name: string, value: string, options?: CookieOptions) =>
    setCookieValue(name, value, options),
  delete: (name: string) => deleteCookieValue(name),
};

export const tokenStorage = new ServerTokenStorage(cookieAdapter, {
  prefix: "linea_",
});

const useStaging = import.meta.env.VITE_CE_ENV === "staging" || !import.meta.env.VITE_CE_ENV;

export const sdk = new StorefrontSDK({
  storeId: import.meta.env.VITE_STORE_ID,
  environment: useStaging ? Environment.Staging : Environment.Production,
  apiKey: import.meta.env.VITE_API_KEY,
  tokenStorage,
  onTokensUpdated: (accessToken, refreshToken) => {
    // SDK -> checkout: keep checkout in sync when SDK tokens change
    // Dynamic import so @commercengine/checkout only loads on client
    if (typeof window !== "undefined") {
      import("@commercengine/checkout").then(({ getCheckout }) => {
        getCheckout().updateTokens(accessToken, refreshToken);
      });
    }
  },
});

/**
 * Ensure anonymous auth tokens exist. Safe to call multiple times —
 * only calls getAnonymousToken() if no access token is present.
 */
export async function ensureAuth() {
  const accessToken = await tokenStorage.getAccessToken();
  if (!accessToken) {
    const { error } = await sdk.auth.getAnonymousToken();
    if (error) {
      throw new Error(`Anonymous auth failed: ${error.message}`);
    }
  }
}
