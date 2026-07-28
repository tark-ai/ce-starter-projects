import { Navigation as SharedNavigation } from "@ce/little-things-shared/header";
import { useCheckout } from "@commercengine/checkout/react";
import { useCategories } from "@/lib/hooks";
import { LittleThingsLink } from "@/lib/little-things-routing";
import { useSearchNavigation } from "@/lib/use-search-navigation";
import { useWishlist } from "@/lib/wishlist";

const Navigation = () => {
  const { openCart, cartCount } = useCheckout();
  const { categories } = useCategories();
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

export default Navigation;
