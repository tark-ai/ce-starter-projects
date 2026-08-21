import { defineCommerceSeoConfig } from "@commercengine/seo/config";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

/**
 * Site identity and public routes, shared by @commercengine/seo and @commercengine/ai.
 *
 * No storefront import, so client components can read this without dragging the server-bound
 * storefront into the browser bundle. Anything holding the SEO instance lives in `seo.ts`.
 */
export const commerceSeo = defineCommerceSeoConfig({
  site: {
    name: SITE_NAME,
    url: SITE_URL,
    brandName: SITE_NAME,
    description: "Timeless fine jewelry, crafted to be worn every day.",
    locale: "en_US",
  },
  routes: {
    productBase: "/product",
    categoryBase: "/category",
  },
});

export const { site, routes } = commerceSeo;
