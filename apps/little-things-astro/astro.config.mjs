import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://little-things-astro.demo.commercengine.com",
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        "@/": new URL("./src/", import.meta.url).pathname,
      },
    },
  },
});
