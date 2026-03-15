import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ce/ui", "@ce/linea-shared"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.commercengine.com",
      },
      {
        protocol: "https",
        hostname: "**.commercengine.io",
      },
    ],
  },
};

export default nextConfig;
