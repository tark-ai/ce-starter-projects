import { Footer } from "@ce/soja-shared/footer";
import { Navigation } from "@ce/soja-shared/header";
import { useCheckout } from "@commercengine/checkout/react";
import type { ReactNode } from "react";
import { useCategories } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useSearchNavigation } from "@/lib/use-search-navigation";
import { useWishlist } from "@/lib/wishlist";

interface LayoutProps {
  children: ReactNode;
  overHero?: boolean;
}

export function Layout({ children, overHero = false }: LayoutProps) {
  const { categories } = useCategories();
  const { cartCount, openCart } = useCheckout();
  const navigateToSearch = useSearchNavigation();
  const wishlist = useWishlist();

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navigation
        LinkComponent={SojaLink}
        categories={categories}
        cartCount={cartCount}
        openCart={openCart}
        onSearchSubmit={navigateToSearch}
        wishlist={wishlist}
        overHero={overHero}
      />
      <main className={overHero ? "-mt-20 flex-1" : "flex-1"}>{children}</main>
      <Footer LinkComponent={SojaLink} />
    </div>
  );
}
