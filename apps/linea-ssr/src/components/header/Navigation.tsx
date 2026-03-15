import { Navigation as SharedNavigation } from "@ce/linea-shared/header";
import { useCheckout } from "@commercengine/checkout/react";
import { useCategories } from "@/lib/hooks";
import { LineaLink } from "@/lib/linea-routing";
import { useLineaSearchNavigation } from "@/lib/use-linea-search-navigation";
import { useWishlist } from "@/lib/wishlist";

const Navigation = () => {
  const { openCart, cartCount } = useCheckout();
  const { categories } = useCategories();
  const { items, count, removeFromWishlist, onAdd } = useWishlist();
  const navigateToSearch = useLineaSearchNavigation();

  return (
    <SharedNavigation
      LinkComponent={LineaLink}
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

export default Navigation;
