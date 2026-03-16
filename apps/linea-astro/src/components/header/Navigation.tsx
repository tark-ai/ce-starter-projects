import { Navigation as SharedNavigation } from "@ce/linea-shared/header";
import { images } from "@ce/ui/lib/images";
import { useCheckout } from "@commercengine/checkout/react";
import type { Category } from "@commercengine/storefront";
import { useCategories } from "@/lib/hooks";
import { LineaLink } from "@/lib/linea-routing";
import { useLineaSearchNavigation } from "@/lib/use-linea-search-navigation";
import { useWishlist } from "@/lib/wishlist";
import Providers from "../Providers";

const NAV_IMAGES = {
  ringsCollection: images.ringsCollection,
  earringsCollection: images.earringsCollection,
  arcusBracelet: images.arcusBracelet,
  spanBracelet: images.spanBracelet,
  founders: images.founders,
  logo: "/LINEA-1.svg",
};

interface NavigationProps {
  serverCategories?: Category[];
}

const NavigationInner = ({ serverCategories }: NavigationProps) => {
  const { openCart, cartCount } = useCheckout();
  const clientCategories = useCategories({ enabled: !serverCategories?.length });
  const categories = serverCategories?.length ? serverCategories : clientCategories.categories;
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
      images={NAV_IMAGES}
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
