/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js layout conventions */
import "@fontsource-variable/inter";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";

import { PoweredByBadge } from "@ce/little-things-ui/components/ui/powered-by-badge";
import type { Category } from "@commercengine/storefront";
import type { Metadata } from "next";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { storefront } from "@/lib/storefront";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Commerce Engine + Next.js Starter Template`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_NAME} is a production-ready e-commerce starter template built with Commerce Engine and Next.js. A reference implementation featuring a tight, opinionated everyday-goods storefront with full catalog, cart, checkout, and search.`,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@commerceengine",
  },
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let categories: Category[] = [];

  try {
    const sdk = storefront.publicStorefront();
    const { data } = await sdk.catalog.listCategories();
    categories = data?.categories ?? [];
  } catch {
    categories = [];
  }

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
