/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js layout conventions */
import "@fontsource-variable/dm-sans";
import "./globals.css";

import { PoweredByBadge } from "@ce/ui/components/ui/powered-by-badge";
import type { Metadata } from "next";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { storefront } from "@/lib/storefront";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Linea — Commerce Engine + Next.js Starter Template",
    template: "%s | Linea",
  },
  description:
    "Linea is a production-ready e-commerce starter template built with Commerce Engine and Next.js. A reference implementation featuring a minimalist jewelry storefront with full catalog, cart, checkout, and search.",
  metadataBase: new URL("https://linea-next.demo.commercengine.com"),
  openGraph: {
    siteName: "Linea",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@commerceengine",
  },
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const sdk = storefront.publicStorefront();
  const { data } = await sdk.catalog.listCategories();
  const categories = data?.categories ?? [];

  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-background">
            <Header categories={categories} />
            {children}
            <Footer />
            <PoweredByBadge />
          </div>
        </Providers>
      </body>
    </html>
  );
}
