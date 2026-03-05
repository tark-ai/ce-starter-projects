import dmSansCss from "@fontsource-variable/dm-sans/index.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { StorefrontInitializer } from "@/components/StorefrontInitializer";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import appCss from "@/index.css?url";
import { ensureServerAuth } from "@/lib/server-fns/auth";
import { WishlistProvider } from "@/lib/wishlist";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    await ensureServerAuth();
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "author", content: "Commerce Engine" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: dmSansCss },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
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
            <Outlet />
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
      <h1 className="text-6xl font-extralight text-foreground mb-4">404</h1>
      <p className="text-lg font-light text-muted-foreground mb-8">Page not found</p>
      <a
        href="/"
        className="text-sm font-light text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors"
      >
        Return to homepage
      </a>
    </div>
  );
}
