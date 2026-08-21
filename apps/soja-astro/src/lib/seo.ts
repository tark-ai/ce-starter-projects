import { createCommerceSeo } from "@commercengine/seo";
import { routes, site } from "./commerce-seo.config";
import { serverStorefront } from "./storefront";

export { routes, site };

/** Server-bound: holds a storefront client. Client code imports `./commerce-seo.config`. */
export const seo = createCommerceSeo({ storefront: serverStorefront, site, routes });
