import { defineCommerceSeoConfig } from "@commercengine/seo/config";

/**
 * Site identity and public routes, shared by @commercengine/seo and @commercengine/ai.
 *
 * No storefront import, so client components can read this without dragging the server-bound
 * storefront into the browser bundle. The instance itself lives in `seo.ts`.
 */
export const commerceSeo = defineCommerceSeoConfig({
  site: {
    name: "Little Things",
    url: "https://little-things-next.demo.commercengine.com",
    brandName: "Little Things",
    description: "Small-batch goods, made to last.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
});

export const { site, routes } = commerceSeo;
