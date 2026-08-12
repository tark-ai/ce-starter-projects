import { PoweredByBadge } from "@ce/soja-ui/components/ui/powered-by-badge";
import { Toaster as Sonner } from "@ce/soja-ui/components/ui/sonner";
import { TooltipProvider } from "@ce/soja-ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, useEffect, useState } from "react";
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

const App = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initStorefront()
      .then(() => setReady(true))
      .catch((err) => {
        // biome-ignore lint/suspicious/noConsole: surface SDK init failures for debugging
        console.error("Failed to initialize storefront:", err);
        setReady(true); // Still show the app so the error boundary can catch render errors
      });
    return () => destroyCheckout();
  }, []);

  if (!ready) {
    return <div className="min-h-svh bg-background" />;
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
