import { createCommerceSeo } from "@commercengine/seo";
import { routes, site } from "$lib/seo-config";
import { serverStorefront } from "$lib/server/storefront";

export { routes, site };

export const seo = createCommerceSeo({ storefront: serverStorefront, site, routes });
