import { Navigation as SharedNavigation } from "@ce/soja-shared/header";
import { useCheckout } from "@commercengine/checkout/react";
import type { Category } from "@commercengine/storefront";
import { useEffect, useState } from "react";
import { useCategories } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useSearchNavigation } from "@/lib/use-search-navigation";
import { useWishlist } from "@/lib/wishlist";
import Providers from "../Providers";

interface NavigationProps {
  serverCategories?: Category[];
  /** Server-rendered path; the header needs it before hydration to pick its colours. */
  initialPathname: string;
}

/**
 * The header is `transition:persist`, so its props are only applied on first
 * mount — a client navigation would otherwise leave the path stale. Seed from
 * the server value, then track the client router.
 */
function usePathname(initialPathname: string) {
  const [pathname, setPathname] = useState(initialPathname);

  useEffect(() => {
    const sync = () => setPathname(window.location.pathname);
    sync();
    document.addEventListener("astro:page-load", sync);
    return () => document.removeEventListener("astro:page-load", sync);
  }, []);

  return pathname;
}

const NavigationInner = ({ serverCategories, initialPathname }: NavigationProps) => {
  const pathname = usePathname(initialPathname);
  const { openCart, cartCount } = useCheckout();
  const clientCategories = useCategories({ enabled: !serverCategories?.length });
  const categories = serverCategories?.length ? serverCategories : clientCategories.categories;
  const wishlist = useWishlist();
  const navigateToSearch = useSearchNavigation();

  return (
    <SharedNavigation
      LinkComponent={SojaLink}
      categories={categories}
      cartCount={cartCount}
      openCart={openCart}
      onSearchSubmit={navigateToSearch}
      wishlist={wishlist}
      overHero={pathname === "/"}
    />
  );
};

export default function Navigation(props: NavigationProps) {
  return (
    <Providers>
      <NavigationInner {...props} />
    </Providers>
  );
}
