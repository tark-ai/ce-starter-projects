import { createCommerceSeo } from "@commercengine/seo";
import { commerceSeo } from "@/lib/commerce-seo.config";
import { storefront } from "@/lib/storefront";

/** Server-bound: holds a storefront client. Client code imports `commerce-seo.config` instead. */
export const seo = createCommerceSeo({ ...commerceSeo, storefront });
