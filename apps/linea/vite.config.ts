import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("react-dom") ||
            id.includes("react-router-dom") ||
            id.includes("/react/")
          ) {
            return "vendor";
          }
          if (id.includes("@tanstack/react-query")) {
            return "query";
          }
        },
      },
    },
  },
}));
