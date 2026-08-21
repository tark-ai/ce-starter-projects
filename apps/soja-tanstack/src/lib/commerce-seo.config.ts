import { defineCommerceSeoConfig } from "@commercengine/seo/config";

/** Shared by @commercengine/seo and @commercengine/ai. No storefront import, so client-safe. */
export const commerceSeo = defineCommerceSeoConfig({
  site: {
    name: "Soja",
    url: "https://soja-tanstack.demo.commercengine.io",
    brandName: "Soja",
    description: "Plant-forward essentials for everyday living.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
});

export const { site, routes } = commerceSeo;
