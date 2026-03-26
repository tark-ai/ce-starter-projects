import { storefront } from "@/lib/storefront";

let sessionBootstrapPromise: Promise<void> | null = null;

/**
 * Bootstraps the anonymous/session cookie once on the client.
 * Components that need session-bound server functions can await this
 * to avoid racing the initial auth setup on first render.
 */
export function ensureClientSessionBootstrapped() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!sessionBootstrapPromise) {
    sessionBootstrapPromise = storefront.bootstrap().catch((error) => {
      sessionBootstrapPromise = null;
      throw error;
    });
  }

  return sessionBootstrapPromise;
}
