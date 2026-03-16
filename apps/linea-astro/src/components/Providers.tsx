import { Toaster as Sonner } from "@ce/ui/components/ui/sonner";
import { Toaster } from "@ce/ui/components/ui/toaster";
import { TooltipProvider } from "@ce/ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WishlistProvider } from "@/lib/wishlist";

// Module-level singleton so all islands on the page share the same cache
const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
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
