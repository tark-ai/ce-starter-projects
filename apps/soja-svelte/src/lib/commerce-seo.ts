import { createCommerceSeo } from "@commercengine/seo";
import { routes, site } from "$lib/commerce-seo.config";
import { serverStorefront } from "$lib/server/storefront";

export { routes, site };

/** Server-bound: holds a storefront client. Client code imports `$lib/commerce-seo.config`. */
export const seo = createCommerceSeo({ storefront: serverStorefront, site, routes });
