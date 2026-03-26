import { Navigation as SharedNavigation } from "@ce/linea-shared/header";
import { useCheckout } from "@commercengine/checkout/react";
import type { Category } from "@commercengine/storefront";
import { LineaLink } from "@/lib/linea-routing";
import { useLineaSearchNavigation } from "@/lib/use-linea-search-navigation";
import { useWishlist } from "@/lib/wishlist";

interface NavigationProps {
  serverCategories?: Category[];
}

const Navigation = ({ serverCategories = [] }: NavigationProps) => {
  const { openCart, cartCount } = useCheckout();
  const { items, count, removeFromWishlist, onAdd } = useWishlist();
  const navigateToSearch = useLineaSearchNavigation();

  return (
    <SharedNavigation
      LinkComponent={LineaLink}
      categories={serverCategories}
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

export default Navigation;
