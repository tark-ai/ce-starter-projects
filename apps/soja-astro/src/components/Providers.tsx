import { TooltipProvider } from "@ce/soja-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { WishlistProvider } from "@/lib/wishlist";

// Module-level so every island on the page shares one cache.
const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
}
