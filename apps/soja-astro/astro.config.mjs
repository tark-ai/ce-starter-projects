import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://soja-astro.demo.commercengine.io",
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        "@/": new URL("./src/", import.meta.url).pathname,
      },
    },
  },
});
