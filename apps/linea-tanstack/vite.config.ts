import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 8081 },
  resolve: {
    tsconfigPaths: true,
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
        filter: ({ path }) => !path.startsWith("/search") && !path.endsWith(".xml"),
      },
    }),
    nitro({ preset: "vercel" }),
    react(),
  ],
});
