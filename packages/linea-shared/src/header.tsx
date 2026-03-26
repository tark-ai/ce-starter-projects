import { formatPrice } from "@ce/ui/lib/format";
import { images as defaultImages, IMAGEKIT_ENDPOINT } from "@ce/ui/lib/images";
import type { Item } from "@commercengine/storefront";
import { Image as ImageKitImage } from "@imagekit/react";
import { ArrowRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { LineaLinkComponent, LineaRoute } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";

export interface NavigationCategory {
  name: string;
  slug?: string | null;
}

export interface NavigationImages {
  ringsCollection: string;
  earringsCollection: string;
  arcusBracelet: string;
  spanBracelet: string;
  founders: string;
  logo: string;
}

interface NavigationProps {
  LinkComponent: LineaLinkComponent;
  categories: NavigationCategory[];
  wishlistItems: Item[];
  wishlistCount: number;
  removeFromWishlist: (productId: string, variantId?: string | null) => void;
  registerOnAdd: (listener: () => void) => () => void;
  cartCount: number;
  openCart: () => void;
  onSearchSubmit: (query: string) => void;
  images?: NavigationImages;
}

const isImageKitAsset = (src: string) => src.startsWith(IMAGEKIT_ENDPOINT);

const getImageKitPath = (src: string) => src.slice(IMAGEKIT_ENDPOINT.length);

function NavigationPromoImage({ alt, src }: { alt: string; src: string }) {
  if (isImageKitAsset(src)) {
    return (
      <ImageKitImage
        urlEndpoint={IMAGEKIT_ENDPOINT}
        src={getImageKitPath(src)}
        alt={alt}
        width={400}
        height={280}
        sizes="400px"
        transformation={[{ quality: 80 }]}
        loading="lazy"
        className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={400}
      height={280}
      loading="lazy"
      decoding="async"
      className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
    />
  );
}

export function Navigation({
  LinkComponent,
  categories,
  wishlistItems,
  wishlistCount,
  removeFromWishlist,
  registerOnAdd,
  cartCount,
  openCart,
  onSearchSubmit,
  images,
}: NavigationProps) {
  const ringsCollection = images?.ringsCollection ?? defaultImages.ringsCollection;
  const earringsCollection = images?.earringsCollection ?? defaultImages.earringsCollection;
  const arcusBracelet = images?.arcusBracelet ?? defaultImages.arcusBracelet;
  const spanBracelet = images?.spanBracelet ?? defaultImages.spanBracelet;
  const founders = images?.founders ?? defaultImages.founders;
  const logo = images?.logo ?? "/LINEA-1.svg";

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [offCanvasType, setOffCanvasType] = useState<"favorites" | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => registerOnAdd(() => setOffCanvasType("favorites")), [registerOnAdd]);

  const categoryNames = categories.map((category) => category.name);

  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsSearchOpen(false);
    setSearchQuery("");
    onSearchSubmit(trimmed);
  };

  const popularSearches = [
    "Gold Rings",
    "Silver Necklaces",
    "Pearl Earrings",
    "Designer Bracelets",
    "Wedding Rings",
    "Vintage Collection",
  ];

  const navItems = [
    {
      name: "Shop",
      href: "/category/shop",
      submenuItems: categoryNames.length > 0 ? categoryNames : ["All Products"],
      images: [
        { src: ringsCollection, alt: "Rings Collection", label: "Rings" },
        { src: earringsCollection, alt: "Earrings Collection", label: "Earrings" },
      ],
    },
    {
      name: "New in",
      href: "/category/new-in",
      submenuItems: [
        "This Week's Arrivals",
        "Spring Collection",
        "Featured Designers",
        "Limited Edition",
        "Pre-Orders",
      ],
      images: [
        { src: arcusBracelet, alt: "Arcus Bracelet", label: "Arcus Bracelet" },
        { src: spanBracelet, alt: "Span Bracelet", label: "Span Bracelet" },
      ],
    },
    {
      name: "About",
      href: "/about/our-story",
      submenuItems: ["Our Story", "Sustainability", "Size Guide", "Customer Care", "Store Locator"],
      images: [{ src: founders, alt: "Company Founders", label: "Read our story" }],
    },
  ];

  const getCategorySlug = (name: string) => {
    const category = categories.find((entry) => entry.name === name);
    return category?.slug || name.toLowerCase().replace(/\s+/g, "-");
  };

  const getSubmenuRoute = (groupName: string, subItem: string): LineaRoute => {
    if (groupName === "About") {
      return {
        path: `/about/${subItem.toLowerCase().replace(/\s+/g, "-")}`,
      };
    }

    if (groupName === "Shop") {
      return {
        path: `/category/${getCategorySlug(subItem)}`,
      };
    }

    return {
      path: `/category/${subItem.toLowerCase()}`,
    };
  };

  const getImageRoute = (groupName: string, label: string): LineaRoute => {
    if (groupName === "Shop") {
      if (label === "Rings") return { path: "/category/rings" };
      if (label === "Earrings") return { path: "/category/earrings" };
    }

    if (groupName === "New in") {
      if (label === "Arcus Bracelet") return { path: "/product/arcus-bracelet" };
      if (label === "Span Bracelet") return { path: "/product/span-bracelet" };
    }

    if (groupName === "About") {
      return { path: "/about/our-story" };
    }

    return { path: "/" };
  };

  return (
    <nav className="relative bg-background/90 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          type="button"
          className="lg:hidden p-2 mt-0.5 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-5 relative">
            <span
              className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 top-2.5" : "top-1.5"
              }`}
            />
            <span
              className={`absolute block w-5 h-px bg-current transform transition-all duration-300 top-2.5 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute block w-5 h-px bg-current transform transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 top-2.5" : "top-3.5"
              }`}
            />
          </div>
        </button>

        <div className="hidden lg:flex space-x-8" role="menubar">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="relative"
              role="menuitem"
              tabIndex={0}
              onMouseEnter={() => setActiveDropdown(item.name)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <LinkComponent
                route={{ path: item.href }}
                className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light py-6 block"
              >
                {item.name}
              </LinkComponent>
            </div>
          ))}
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <LinkComponent route={{ path: "/" }} className="block">
            <img src={logo} alt="LINEA" className="h-6 w-auto" />
          </LinkComponent>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200"
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
              role="img"
              aria-label="Search icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
            aria-label="Favorites"
            onClick={() => setOffCanvasType("favorites")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
              role="img"
              aria-label="Favorites icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[0.5rem] font-semibold rounded-full size-4 flex items-center justify-center pointer-events-none">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            type="button"
            className="p-2 text-nav-foreground hover:text-nav-hover transition-colors duration-200 relative"
            aria-label="Shopping bag"
            onClick={openCart}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
              role="img"
              aria-label="Shopping bag icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[30%] text-[0.5rem] font-semibold text-foreground pointer-events-none">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeDropdown && (
        <div
          className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50"
          role="menu"
          onMouseEnter={() => setActiveDropdown(activeDropdown)}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <div className="px-6 py-8">
            <div className="flex justify-between w-full">
              <div className="flex-1">
                <ul className="space-y-2">
                  {navItems
                    .find((item) => item.name === activeDropdown)
                    ?.submenuItems.map((subItem) => (
                      <li key={subItem}>
                        <LinkComponent
                          route={getSubmenuRoute(activeDropdown, subItem)}
                          className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-sm font-light block py-2"
                        >
                          {subItem}
                        </LinkComponent>
                      </li>
                    ))}
                </ul>
              </div>

              <div className="flex space-x-6">
                {navItems
                  .find((item) => item.name === activeDropdown)
                  ?.images.map((image) => (
                    <LinkComponent
                      key={image.src}
                      route={getImageRoute(activeDropdown, image.label)}
                      className="w-[400px] h-[280px] cursor-pointer group relative overflow-hidden block"
                    >
                      <NavigationPromoImage src={image.src} alt={image.alt} />
                      <div className="absolute bottom-2 left-2 text-white text-xs font-light flex items-center gap-1">
                        <span>{image.label}</span>
                        <ArrowRight size={12} />
                      </div>
                    </LinkComponent>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="relative mb-8">
                <div className="flex items-center border-b border-border pb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-nav-foreground mr-3"
                    role="img"
                    aria-label="Search icon"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for jewelry..."
                    className="flex-1 bg-transparent text-nav-foreground placeholder:text-nav-foreground/60 outline-none text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") submitSearch(searchQuery);
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-nav-foreground text-sm font-light mb-4">Popular Searches</h3>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      type="button"
                      className="text-nav-foreground hover:text-nav-hover text-sm font-light py-2 px-4 border border-border rounded-full transition-colors duration-200 hover:border-nav-hover"
                      onClick={() => submitSearch(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-nav border-b border-border z-50">
          <div className="px-6 py-8">
            <div className="space-y-6">
              {navItems.map((item) => (
                <div key={item.name}>
                  <LinkComponent
                    route={{ path: item.href }}
                    className="text-nav-foreground hover:text-nav-hover transition-colors duration-200 text-lg font-light block py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </LinkComponent>
                  <div className="mt-3 pl-4 space-y-2">
                    {item.submenuItems.map((subItem) => (
                      <LinkComponent
                        key={subItem}
                        route={getSubmenuRoute(item.name, subItem)}
                        className="text-nav-foreground/70 hover:text-nav-hover text-sm font-light block py-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subItem}
                      </LinkComponent>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {offCanvasType === "favorites" && (
        <div className="fixed inset-0 z-50 h-screen">
          <button
            type="button"
            className="absolute inset-0 bg-black/50 h-screen border-0 p-0 cursor-pointer"
            onClick={() => setOffCanvasType(null)}
            aria-label="Close favorites panel"
          />

          <div className="absolute right-0 top-0 h-screen w-96 bg-background border-l border-border animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-light text-foreground">Your Favorites</h2>
              <button
                type="button"
                onClick={() => setOffCanvasType(null)}
                className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {wishlistItems.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  You haven't added any favorites yet. Browse our collection and click the heart
                  icon to save items you love.
                </p>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.sku} className="flex gap-4 group/item">
                      <LinkComponent
                        route={{
                          path: `/product/${item.product_slug}`,
                          search: item.variant_slug ? { variant: item.variant_slug } : undefined,
                        }}
                        onClick={() => setOffCanvasType(null)}
                        className="shrink-0"
                      >
                        <StorefrontImage
                          image={item.images?.[0]}
                          alt={item.product_name}
                          variant="thumbnail"
                          width={80}
                          height={80}
                          loading="lazy"
                          className="w-20 h-20 object-cover bg-muted/10"
                        />
                      </LinkComponent>
                      <div className="flex-1 min-w-0">
                        <LinkComponent
                          route={{
                            path: `/product/${item.product_slug}`,
                            search: item.variant_slug ? { variant: item.variant_slug } : undefined,
                          }}
                          onClick={() => setOffCanvasType(null)}
                          className="block"
                        >
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.variant_name || item.product_name}
                          </p>
                          <p className="text-sm font-light text-muted-foreground">
                            {formatPrice(item.pricing.selling_price, item.pricing.currency)}
                          </p>
                        </LinkComponent>
                        <button
                          type="button"
                          onClick={() => removeFromWishlist(item.product_id, item.variant_id)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
