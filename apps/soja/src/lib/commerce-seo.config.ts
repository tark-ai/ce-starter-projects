import { defineCommerceSeoConfig } from "@commercengine/seo/config";

/**
 * Site identity and public routes, shared by @commercengine/seo and @commercengine/ai.
 * No storefront import, so client code can read this without pulling one into the bundle.
 */
export const commerceSeo = defineCommerceSeoConfig({
  site: {
    name: "Soja",
    url: "https://soja.demo.commercengine.com",
    brandName: "Soja",
    description: "Plant-forward essentials for everyday living.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
});

export const { site, routes } = commerceSeo;
