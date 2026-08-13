"use client";

import { PoweredByBadge } from "@ce/soja-ui/components/ui/powered-by-badge";
import { Toaster as Sonner } from "@ce/soja-ui/components/ui/sonner";
import { TooltipProvider } from "@ce/soja-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { StorefrontBootstrap } from "@/components/StorefrontBootstrap";
import { WishlistProvider } from "@/lib/wishlist";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <StorefrontBootstrap />
      <WishlistProvider>
        <TooltipProvider>
          <Sonner />
          <PoweredByBadge />
          {children}
        </TooltipProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
}
