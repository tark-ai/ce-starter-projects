import { Navigation as SharedNavigation } from "@ce/soja-shared/header";
import { useCheckout } from "@commercengine/checkout/react";
import type { Category } from "@commercengine/storefront";
import { useRouterState } from "@tanstack/react-router";
import { useCategories } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useSearchNavigation } from "@/lib/use-search-navigation";
import { useWishlist } from "@/lib/wishlist";

interface NavigationProps {
  serverCategories?: Category[];
}

const Navigation = ({ serverCategories }: NavigationProps) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
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
      // Mounted once by the root route, so it reads the photo-led state off the route.
      overHero={pathname === "/"}
    />
  );
};

export default Navigation;
