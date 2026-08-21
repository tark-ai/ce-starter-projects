import { defineCommerceSeoConfig } from "@commercengine/seo/config";

/**
 * Site identity and public routes, shared by @commercengine/seo and @commercengine/ai.
 *
 * No storefront import, so client components can read this without dragging the server-bound
 * storefront into the browser bundle. The instance itself lives in `seo.ts`.
 */
export const commerceSeo = defineCommerceSeoConfig({
  site: {
    name: "Soja",
    url: "https://soja-next.demo.commercengine.io",
    brandName: "Soja",
    description: "Plant-forward essentials for everyday living.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
});

export const { site, routes } = commerceSeo;
