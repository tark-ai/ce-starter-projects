import { defineCommerceSeoConfig } from "@commercengine/seo/config";

/** Shared by @commercengine/seo and @commercengine/ai. No storefront import, so client-safe. */
export const commerceSeo = defineCommerceSeoConfig({
  site: {
    name: "Little Things",
    url: "https://little-things-tanstack.demo.commercengine.com",
    brandName: "Little Things",
    description: "Small-batch goods, made to last.",
    locale: "en_US",
  },
  routes: { productBase: "/product", categoryBase: "/category" },
});

export const { site, routes } = commerceSeo;
