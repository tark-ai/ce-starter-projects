"use client";

import { createHostedCheckoutBridge } from "@commercengine/ai/checkout";
import { registerCommerceWebMcp } from "@commercengine/ai/webmcp";
import { getCheckout } from "@commercengine/checkout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { routes, site } from "@/lib/commerce-seo.config";
import { storefront } from "@/lib/storefront";

/**
 * Registers this storefront's WebMCP tools so an agent can search the catalog, resolve
 * variants, navigate, and work with the shopper's real cart.
 *
 * No-ops in browsers without WebMCP. Mounted after StorefrontBootstrap so the session and
 * Hosted Checkout are already initialized.
 */
export function AgentTools() {
  const router = useRouter();

  useEffect(() => {
    let registration: AbortController | null = null;
    let cancelled = false;

    void registerCommerceWebMcp({
      storefront,
      siteUrl: site.url,
      routes,
      checkout: createHostedCheckoutBridge({ getState: () => getCheckout() }),
      navigation: { navigate: (url) => router.push(url) },
      // The package reports the outcome; `unsupported` is the ordinary case in a browser
      // without WebMCP, not a fault.
      diagnostics:
        process.env.NODE_ENV === "development"
          ? // biome-ignore lint/suspicious/noConsole: development diagnostic
            (event) => console.info("[commerce-ai]", event.code, event.message ?? "")
          : undefined,
    }).then((controller) => {
      if (cancelled) controller?.abort();
      else registration = controller;
    });

    return () => {
      cancelled = true;
      registration?.abort();
    };
  }, [router]);

  return null;
}
