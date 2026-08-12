import { PoweredByBadge } from "@ce/soja-ui/components/ui/powered-by-badge";
import { Toaster as Sonner } from "@ce/soja-ui/components/ui/sonner";
import { TooltipProvider } from "@ce/soja-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { destroyCheckout, initStorefront } from "./lib/storefront";
import { WishlistProvider } from "./lib/wishlist";
import Index from "./pages/Index";

const Category = lazy(() => import("./pages/Category"));
const Search = lazy(() => import("./pages/Search"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Faq = lazy(() => import("./pages/Faq"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

type BootstrapState = "pending" | "ready" | "failed";

const App = () => {
  const [bootstrap, setBootstrap] = useState<BootstrapState>("pending");

  const runBootstrap = useCallback(async () => {
    setBootstrap("pending");
    try {
      await initStorefront();
      setBootstrap("ready");
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: surface SDK init failures for debugging
      console.error("Failed to initialize storefront:", error);
      setBootstrap("failed");
    }
  }, []);

  useEffect(() => {
    void runBootstrap();
    return () => destroyCheckout();
  }, [runBootstrap]);

  if (bootstrap === "pending") {
    return <div className="min-h-svh bg-background" />;
  }

  // Rendering the storefront without a checkout session leaves every cart control
  // inert, so offer a retry rather than a silently unbuyable site.
  if (bootstrap === "failed") {
    return (
      <main className="soja-container flex min-h-svh flex-col justify-center py-32">
        <h1 className="font-display text-[2rem] tracking-display tablet:text-display">
          We couldn't reach the store
        </h1>
        <p className="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
          The connection to our catalog failed, so browsing and checkout are unavailable.
        </p>
        <button
          type="button"
          onClick={() => void runBootstrap()}
          className="mt-10 h-12 w-fit bg-primary px-8 text-meta text-primary-foreground transition-colors duration-300 ease-soja hover:bg-primary-hover"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <TooltipProvider>
          <Sonner />
          <PoweredByBadge />
          <BrowserRouter>
            <ScrollToTop />
            <ErrorBoundary>
              <Suspense fallback={<div className="min-h-svh bg-background" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/all-products" element={<Category />} />
                  <Route path="/category/:category" element={<Category />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/our-story" element={<About />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/legal/privacy" element={<PrivacyPolicy />} />
                  <Route path="/legal/terms" element={<TermsOfService />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </WishlistProvider>
    </QueryClientProvider>
  );
};

export default App;
