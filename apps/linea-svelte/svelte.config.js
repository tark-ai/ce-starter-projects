import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: "404.html" }),
    alias: {
      "@/*": "./src/*",
    },
    prerender: {
      crawl: true,
      entries: [
        "/",
        "/category/shop",
        "/about/our-story",
        "/about/sustainability",
        "/about/size-guide",
        "/about/customer-care",
        "/about/store-locator",
        "/privacy-policy",
        "/terms-of-service",
      ],
    },
  },
};

export default config;
