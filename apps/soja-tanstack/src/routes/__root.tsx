import { PoweredByBadge } from "@ce/soja-ui/components/ui/powered-by-badge";
import { Toaster as Sonner } from "@ce/soja-ui/components/ui/sonner";
import { TooltipProvider } from "@ce/soja-ui/components/ui/tooltip";
import type { Category } from "@commercengine/storefront";
import averageCss from "@fontsource/average/400.css?url";
import averiaLightCss from "@fontsource/averia-serif-libre/300.css?url";
import averiaCss from "@fontsource/averia-serif-libre/400.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import Footer from "@/components/footer/Footer";
import Navigation from "@/components/header/Navigation";
import { StorefrontInitializer } from "@/components/StorefrontInitializer";
import appCss from "@/index.css?url";
import { OG_IMAGE, SITE_NAME } from "@/lib/constants";
import { fetchCategories } from "@/lib/server-fns/catalog";
import { WishlistProvider } from "@/lib/wishlist";

interface RouterContext {
  queryClient: QueryClient;
}

export interface RootLoaderData {
  categories: Category[];
}

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: async (): Promise<RootLoaderData> => {
    try {
      return { categories: await fetchCategories() };
    } catch {
      return { categories: [] };
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "author", content: "Commerce Engine" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: OG_IMAGE.url },
      { property: "og:image:width", content: String(OG_IMAGE.width) },
      { property: "og:image:height", content: String(OG_IMAGE.height) },
      { property: "og:image:alt", content: OG_IMAGE.alt },
      { name: "twitter:site", content: "@commerceengine" },
      { name: "twitter:image", content: OG_IMAGE.url },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "stylesheet", href: averiaLightCss },
      { rel: "stylesheet", href: averiaCss },
      { rel: "stylesheet", href: averageCss },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const { categories } = Route.useLoaderData();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <StorefrontInitializer />
        <TooltipProvider>
          <WishlistProvider>
            <Sonner />
            <PoweredByBadge />
            <div className="flex min-h-svh flex-col bg-background">
              <Navigation serverCategories={categories} />
              <div className="flex flex-1 flex-col">
                <Outlet />
              </div>
              <Footer />
            </div>
          </WishlistProvider>
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFoundComponent() {
  return (
    <main className="soja-container py-32 tablet:py-48">
      <h1 className="font-display text-[2rem] tracking-display tablet:text-display">
        This page has gone quiet
      </h1>
      <p className="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
        The page you were looking for isn't here. Return to the collection.
      </p>
      <a
        href="/all-products"
        className="mt-10 inline-flex items-center gap-2 text-meta transition-opacity duration-300 ease-soja hover:opacity-60"
      >
        Shop the collection
        <span aria-hidden className="h-1.5 w-1.5 bg-current" />
      </a>
    </main>
  );
}
