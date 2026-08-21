import { createCommerceSeo } from "@commercengine/seo";
import { commerceSeo } from "@/lib/commerce-seo.config";
import { storefront } from "@/lib/storefront";

/**
 * Server-bound: this holds a storefront client. Client code wanting `site` or `routes` must
 * import `@/lib/commerce-seo.config` instead.
 */
export const seo = createCommerceSeo({ ...commerceSeo, storefront });
