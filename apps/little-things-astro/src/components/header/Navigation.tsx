import { Navigation as SharedNavigation } from "@ce/little-things-shared/header";
import { useCheckout } from "@commercengine/checkout/react";
import type { Category } from "@commercengine/storefront";
import { useCategories } from "@/lib/hooks";
import { LittleThingsLink } from "@/lib/little-things-routing";
import { useSearchNavigation } from "@/lib/use-search-navigation";
import { useWishlist } from "@/lib/wishlist";
import Providers from "../Providers";

interface NavigationProps {
  serverCategories?: Category[];
}

const NavigationInner = ({ serverCategories }: NavigationProps) => {
  const { openCart, cartCount } = useCheckout();
  const clientCategories = useCategories({ enabled: !serverCategories?.length });
  const categories = serverCategories?.length ? serverCategories : clientCategories.categories;
  const { items, count, removeFromWishlist, onAdd } = useWishlist();
  const navigateToSearch = useSearchNavigation();

  return (
    <SharedNavigation
      LinkComponent={LittleThingsLink}
      categories={categories}
      wishlistItems={items}
      wishlistCount={count}
      removeFromWishlist={removeFromWishlist}
      registerOnAdd={onAdd}
      cartCount={cartCount}
      openCart={openCart}
      onSearchSubmit={navigateToSearch}
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
