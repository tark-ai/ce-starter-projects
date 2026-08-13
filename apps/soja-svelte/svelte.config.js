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
        // Reached through a scripted navigation from the header, so crawling
        // never discovers it.
        "/search",
        "/all-products",
        "/about",
        "/our-story",
        "/faq",
        "/privacy-policy",
        "/terms-of-service",
        "/legal/privacy",
        "/legal/terms",
      ],
    },
  },
};

export default config;
