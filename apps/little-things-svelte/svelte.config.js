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
        "/all-products",
        "/category/shop",
        "/about",
        "/privacy-policy",
        "/terms-of-service",
        "/legal/privacy",
        "/legal/terms",
        "/blog",
      ],
    },
  },
};

export default config;
