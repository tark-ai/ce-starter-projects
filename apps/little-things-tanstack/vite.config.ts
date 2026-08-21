import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Routes referenced by shared header/footer chrome that are not implemented in
// this starter (marketing/auth placeholders). Excluded from prerender so link
// crawling doesn't try to statically render non-existent routes.
const UNIMPLEMENTED_PATHS = new Set([
  "/contact",
  "/membership",
  "/affiliates",
  "/login",
  "/signup",
  "/help",
]);

export default defineConfig({
  server: { port: 8091 },
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
        filter: ({ path }) =>
          !path.startsWith("/search") && !path.endsWith(".xml") && !UNIMPLEMENTED_PATHS.has(path),
      },
    }),
    nitro({ preset: "vercel" }),
    react(),
  ],
});
