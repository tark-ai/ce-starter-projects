/**
 * Route and site identity, shared by @commercengine/seo and @commercengine/ai.
 *
 * Deliberately free of any storefront import so the browser bundle can read it without
 * pulling in the server-side storefront.
 */
export const routes = {
  productBase: "/product",
  categoryBase: "/category",
} as const;

export const site = {
  name: "LINEA",
  url: "https://linea-astro.demo.commercengine.com",
  brandName: "LINEA",
  description: "Timeless fine jewelry, crafted to be worn every day.",
  locale: "en_US",
} as const;
