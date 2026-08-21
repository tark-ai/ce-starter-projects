import { SITE_NAME, SITE_URL } from "./constants";

/**
 * Route and site identity shared by @commercengine/seo and @commercengine/ai, so a crawler
 * and an agent are told the same URL for the same product.
 */
export const routes = { productBase: "/product", categoryBase: "/category" } as const;

export const site = {
  name: SITE_NAME,
  url: SITE_URL,
  brandName: SITE_NAME,
  description: "Timeless fine jewelry, crafted to be worn every day.",
  locale: "en_US",
} as const;
