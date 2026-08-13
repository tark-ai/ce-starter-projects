import { PoweredByBadge } from "@ce/soja-ui/components/ui/powered-by-badge";
import { Toaster as Sonner } from "@ce/soja-ui/components/ui/sonner";
import { TooltipProvider } from "@ce/soja-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import { destroyCheckout, initStorefront, withTimeout } from "./lib/storefront";
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

const BOOTSTRAP_ATTEMPTS = 3;
const BOOTSTRAP_TIMEOUT_MS = 10_000;

/** Cart and favourites need the session the bootstrap creates; browsing does not. */
const SessionNotice = ({ onRetry }: { onRetry: () => void }) => (
  <div
    role="status"
    className="fixed bottom-4 left-4 z-50 flex max-w-[320px] flex-col gap-3 bg-neutral-900 px-4 py-3 text-white shadow-md"
  >
    <p className="text-meta leading-relaxed">
      We couldn't reach the store, so cart and favourites are unavailable.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="h-9 w-fit bg-white px-4 text-meta text-neutral-900 transition-opacity duration-300 ease-soja hover:opacity-80"
    >
      Try again
    </button>
  </div>
);

const App = () => {
  const [bootstrap, setBootstrap] = useState<BootstrapState>("pending");
  const mounted = useRef(true);
  const generation = useRef(0);

  const runBootstrap = useCallback(async (force = false) => {
    // Retrying during the backoff supersedes the loop that is already running:
    // without that, the older loop's failure can land after the newer one has
    // succeeded and flip the notice back on over a live session.
    generation.current += 1;
    const run = generation.current;

    for (let attempt = 0; attempt < BOOTSTRAP_ATTEMPTS; attempt += 1) {
      try {
        await withTimeout(
          initStorefront({ force: (force && attempt === 0) || attempt > 0 }),
          BOOTSTRAP_TIMEOUT_MS
        );
        if (!mounted.current || generation.current !== run) return;
        // A read that ran while the session was missing stays errored on its own;
        // nothing is cached under this key before the provider mounts, so on the
        // first-attempt path this invalidates nothing.
        void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        setBootstrap("ready");
        return;
      } catch (error) {
        if (!mounted.current || generation.current !== run) return;
        // Surface the storefront after the first failure: only cart and favourites
        // need the session, so blocking the catalog and the legal pages too would
        // cost more than the degraded state it prevents.
        // biome-ignore lint/suspicious/noConsole: surface SDK init failures for debugging
        console.error("Failed to initialize storefront:", error);
        setBootstrap("failed");

        if (attempt < BOOTSTRAP_ATTEMPTS - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500 * 2 ** attempt));
          if (!mounted.current || generation.current !== run) return;
        }
      }
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void runBootstrap();
    return () => {
      mounted.current = false;
      destroyCheckout();
    };
  }, [runBootstrap]);

  if (bootstrap === "pending") {
    return <div className="min-h-svh bg-background" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WishlistProvider>
        <TooltipProvider>
          <Sonner />
          <PoweredByBadge />
          {bootstrap === "failed" && <SessionNotice onRetry={() => void runBootstrap(true)} />}
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
