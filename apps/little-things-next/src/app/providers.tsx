"use client";

import { Toaster as Sonner } from "@ce/little-things-ui/components/ui/sonner";
import { Toaster } from "@ce/little-things-ui/components/ui/toaster";
import { TooltipProvider } from "@ce/little-things-ui/components/ui/tooltip";
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
          <Toaster />
          <Sonner />
          {children}
        </TooltipProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
}
