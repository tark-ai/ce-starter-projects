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

export function installLittleThingsClientRuntime() {
  if (runtimeInstalled) return;
  runtimeInstalled = true;

  document.addEventListener("astro:page-load", bootstrapStorefront);
  document.addEventListener("astro:before-swap", onBeforeSwap);

  bootstrapStorefront();
}
