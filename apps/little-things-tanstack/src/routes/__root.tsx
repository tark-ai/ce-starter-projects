import { PoweredByBadge } from "@ce/little-things-ui/components/ui/powered-by-badge";
import { Toaster as Sonner } from "@ce/little-things-ui/components/ui/sonner";
import { Toaster } from "@ce/little-things-ui/components/ui/toaster";
import { TooltipProvider } from "@ce/little-things-ui/components/ui/tooltip";
import type { Category } from "@commercengine/storefront";
import instrumentSerifCss from "@fontsource/instrument-serif/400.css?url";
import instrumentSerifItalicCss from "@fontsource/instrument-serif/400-italic.css?url";
import interCss from "@fontsource-variable/inter/index.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { StorefrontInitializer } from "@/components/StorefrontInitializer";
import appCss from "@/index.css?url";
import { SITE_NAME } from "@/lib/constants";
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
      const categories = await fetchCategories();
      return { categories };
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
      { name: "twitter:site", content: "@commerceengine" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: interCss },
      { rel: "stylesheet", href: instrumentSerifCss },
      { rel: "stylesheet", href: instrumentSerifItalicCss },
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
            <Toaster />
            <Sonner />
            <div className="min-h-screen bg-background">
              <Header categories={categories} />
              <Outlet />
              <Footer />
              <PoweredByBadge />
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold tracking-tight text-foreground mb-4">404</h1>
      <p className="text-lg font-light text-muted-foreground mb-8">
        Well, this page doesn't exist. But plenty of good things do.
      </p>
      <a
        href="/"
        className="text-sm font-medium text-brand underline underline-offset-4 transition-opacity hover:opacity-80"
      >
        Back to home
      </a>
    </div>
  );
}
