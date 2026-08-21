import { swapFunctions, type TransitionBeforeSwapEvent } from "astro:transitions/client";
import { initStorefront } from "@/lib/storefront-client";

const PAGE_CONTENT_SELECTOR = "[data-page-content]";

let runtimeInstalled = false;

function bootstrapStorefront() {
  void initStorefront();
}

function handleBeforeSwap(event: TransitionBeforeSwapEvent) {
  event.swap = () => {
    swapFunctions.deselectScripts(event.newDocument);
    swapFunctions.swapRootAttributes(event.newDocument);
    swapFunctions.swapHeadElements(event.newDocument);
    const restoreFocus = swapFunctions.saveFocus();

    const nextContent = event.newDocument.querySelector(PAGE_CONTENT_SELECTOR);
    const currentContent = document.querySelector(PAGE_CONTENT_SELECTOR);

    if (nextContent && currentContent) {
      swapFunctions.swapBodyElement(nextContent as HTMLElement, currentContent as HTMLElement);
    } else {
      swapFunctions.swapBodyElement(event.newDocument.body, document.body);
    }

    restoreFocus();
  };
}

function isBeforeSwapEvent(event: Event): event is TransitionBeforeSwapEvent {
  return "newDocument" in event && "swap" in event;
}

function onBeforeSwap(event: Event) {
  if (!isBeforeSwapEvent(event)) return;
  handleBeforeSwap(event);
}

/**
 * Register WebMCP tools once the storefront session exists.
 *
 * View Transitions replace the document, so the previous registration is aborted before
 * re-registering — otherwise every navigation would install a duplicate tool set.
 */
let agentTools: AbortController | null = null;

async function registerAgentTools() {
  const [
    { registerCommerceWebMcp },
    { createHostedCheckoutBridge },
    { getCheckout },
    { storefront },
    { routes, site },
  ] = await Promise.all([
    import("@commercengine/ai/webmcp"),
    import("@commercengine/ai/checkout"),
    import("@commercengine/checkout"),
    import("./storefront-client"),
    import("./seo-config"),
  ]);

  agentTools?.abort();
  agentTools = await registerCommerceWebMcp({
    storefront,
    siteUrl: site.url,
    routes,
    checkout: createHostedCheckoutBridge({ getState: () => getCheckout() }),
    navigation: {
      navigate: (url) => {
        window.location.href = url;
      },
    },
  });
}

export function installLineaClientRuntime() {
  if (runtimeInstalled) return;
  runtimeInstalled = true;

  document.addEventListener("astro:page-load", bootstrapStorefront);
  document.addEventListener("astro:page-load", () => void registerAgentTools());
  document.addEventListener("astro:before-swap", onBeforeSwap);

  bootstrapStorefront();
}
