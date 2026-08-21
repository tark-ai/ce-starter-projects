import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 8101 },
  resolve: {
    tsconfigPaths: true,
    // Nitro's Vite environment otherwise resolves tslib's CommonJS wrapper,
    // whose synthetic default export is undefined under Rolldown.
    alias: {
      tslib: fileURLToPath(import.meta.resolve("tslib/tslib.es6.mjs")),
    },
  },
  plugins: [
    // TanStack Start needs a runtime adapter to emit deployable server output.
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        concurrency: 10,
        // /search is query-driven, so there is nothing to statically render.
        filter: ({ path }) => !path.startsWith("/search") && !path.endsWith(".xml"),
      },
    }),
    nitro({ preset: "vercel" }),
    react(),
  ],
});
