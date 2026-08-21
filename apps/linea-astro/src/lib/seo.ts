import { createCommerceSeo } from "@commercengine/seo";
import { routes, site } from "./seo-config";
import { serverStorefront } from "./storefront";

export { routes, site };

export const seo = createCommerceSeo({ storefront: serverStorefront, site, routes });
