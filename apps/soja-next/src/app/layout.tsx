/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js layout conventions */
import "@fontsource/averia-serif-libre/300.css";
import "@fontsource/averia-serif-libre/400.css";
import "@fontsource/average/400.css";
import "./globals.css";

import type { Category } from "@commercengine/storefront";
import type { Metadata } from "next";
import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navigation";
import { OG_IMAGES, SITE_NAME, SITE_URL, TWITTER_IMAGE } from "@/lib/constants";
import { storefront } from "@/lib/storefront";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Commerce Engine + Next.js Starter Template`,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_NAME} is a production-ready e-commerce starter template built with Commerce Engine and Next.js. A reference implementation for a quiet-luxury Scandinavian skincare storefront with full catalog, cart, checkout, and search.`,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    images: OG_IMAGES,
  },
  twitter: {
    card: "summary_large_image",
    site: "@commerceengine",
    images: [TWITTER_IMAGE],
  },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
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
          <div className="flex min-h-svh flex-col bg-background">
            <Navigation serverCategories={categories} />
            <div className="flex flex-1 flex-col">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
