import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Workaround: Cloudflare Vite Plugin registers interactive CLI shortcuts when
// process.stdin.isTTY is true, causing Miniflare to crash during prerendering
// under Turborepo. Setting CI=true forces non-interactive mode.
// See: https://github.com/vercel/turborepo/issues/11412
if (process.env.TURBO_HASH) process.env.CI = "true";

export default defineConfig({
  server: { port: 8081 },
  resolve: { tsconfigPaths: true },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoStaticPathsDiscovery: true,
        concurrency: 10,
        filter: ({ path }) => !path.startsWith("/search") && !path.endsWith(".xml"),
      },
    }),
    react(),
  ],
});
