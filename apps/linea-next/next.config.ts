import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ce/ui", "@ce/linea-shared"],
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.commercengine.com",
      },
      {
        protocol: "https",
        hostname: "**.commercengine.io",
      },
      {
        protocol: "https",
        hostname: "images.tarkai.com",
      },
    ],
  },
};

export default nextConfig;
