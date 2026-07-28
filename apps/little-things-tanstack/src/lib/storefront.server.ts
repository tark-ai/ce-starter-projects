import { createTanStackStartServerStorefront } from "@commercengine/storefront/tanstack-start/server";
import { storefrontConfig } from "./storefront";

const serverStorefrontFactory = createTanStackStartServerStorefront(storefrontConfig);

export function serverStorefront() {
  return serverStorefrontFactory.serverStorefront();
}
