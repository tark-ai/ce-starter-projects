import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// The Cloudflare plugin registers interactive CLI shortcuts when stdin is a TTY,
// which crashes Miniflare during prerender under Turborepo.
// https://github.com/vercel/turborepo/issues/11412
if (process.env.TURBO_HASH) process.env.CI = "true";

const isVercel = process.env.VERCEL === "1";

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
    ...(!isVercel ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
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
    ...(isVercel ? [nitro({ preset: "vercel" })] : []),
    react(),
  ],
});
