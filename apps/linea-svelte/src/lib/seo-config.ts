import { SITE_NAME, SITE_URL } from "$lib/seo";

/**
 * Route and site identity shared by @commercengine/seo and @commercengine/ai.
 * No storefront import, so the browser bundle can read it without pulling in the server SDK.
 */
export const routes = { productBase: "/product", categoryBase: "/category" } as const;

export const site = {
  name: SITE_NAME,
  url: SITE_URL,
  brandName: SITE_NAME,
  description: "Timeless fine jewelry, crafted to be worn every day.",
  locale: "en_US",
} as const;
