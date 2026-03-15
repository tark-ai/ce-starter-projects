import circularCollection from "@ce/ui/assets/circular-collection.jpg";
import earringsCollection from "@ce/ui/assets/earrings-collection.jpg";
import founders from "@ce/ui/assets/founders.jpg";
import heroImage from "@ce/ui/assets/hero-image.jpg";
import linkBracelet from "@ce/ui/assets/link-bracelet.jpg";
import organicEarring from "@ce/ui/assets/organic-earring.jpg";
import { Card, CardContent } from "@ce/ui/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@ce/ui/components/ui/carousel";
import { formatPrice } from "@ce/ui/lib/format";
import type { Item } from "@commercengine/storefront";
import { Image } from "@unpic/react";
import { ArrowRight } from "lucide-react";
import type { LineaLinkComponent } from "./lib/routing";
import { WishlistButton } from "./product";

interface ProductCarouselProps {
  items: Item[];
  isLoading: boolean;
  LinkComponent: LineaLinkComponent;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
}

export function ProductCarousel({
  items,
  isLoading,
  LinkComponent,
  isInWishlist,
  onToggleWishlist,
}: ProductCarouselProps) {
  if (isLoading) {
    const skeletonIds = ["c1", "c2", "c3", "c4"];
    return (
      <section className="w-full mb-16 px-6">
        <div className="flex gap-4">
          {skeletonIds.map((id) => (
            <div key={id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 shrink-0">
              <div className="aspect-square bg-muted/20 animate-pulse mb-3" />
              <div className="h-4 w-20 bg-muted/20 animate-pulse mb-1" />
              <div className="h-4 w-32 bg-muted/20 animate-pulse" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full mb-16 px-6">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="">
          {items.map((item) => (
            <CarouselItem
              key={`${item.product_id}:${item.variant_id ?? "product"}`}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
            >
              <LinkComponent
                route={{
                  path: `/product/${item.product_slug}`,
                  search: item.variant_slug ? { variant: item.variant_slug } : undefined,
                }}
              >
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="p-0">
                    <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                      <Image
                        src={item.images?.[0]?.url_standard ?? ""}
                        alt={item.images?.[0]?.alternate_text || item.product_name}
                        layout="fullWidth"
                        className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                      />
                      <Image
                        src={item.images?.[1]?.url_standard || item.images?.[0]?.url_standard || ""}
                        alt={`${item.variant_name || item.product_name} alternate`}
                        layout="fullWidth"
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-black/[0.03]" />
                      <WishlistButton
                        active={isInWishlist(item.product_id, item.variant_id)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onToggleWishlist(item.product_id, item.variant_id);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-light text-foreground">
                        {item.categories?.[0]?.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">
                          {item.variant_name || item.product_name}
                        </h3>
                        <p className="text-sm font-light text-foreground">
                          {formatPrice(item.pricing.selling_price, item.pricing.currency)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </LinkComponent>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}

// --- LargeHero ---

export function LargeHero() {
  return (
    <section className="w-full mb-16 px-6">
      <div className="w-full aspect-[16/9] mb-3 overflow-hidden">
        <Image
          src={heroImage}
          alt="Modern jewelry collection"
          layout="fullWidth"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="">
        <h2 className="text-sm font-normal text-foreground mb-1">Modern Heritage</h2>
        <p className="text-sm font-light text-foreground">
          Contemporary jewelry crafted with timeless elegance
        </p>
      </div>
    </section>
  );
}

// --- EditorialSection ---

interface EditorialSectionProps {
  LinkComponent: LineaLinkComponent;
}

export function EditorialSection({ LinkComponent }: EditorialSectionProps) {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 max-w-[630px]">
          <h2 className="text-2xl font-normal text-foreground leading-tight md:text-xl">
            Jewelry Drawn From Shadows and Lines
          </h2>
          <p className="text-sm font-light text-foreground leading-relaxed">
            Linea was born from the meeting of two minds who saw beauty not just in ornament, but in
            structure. With backgrounds spanning architecture and fine arts, the founders believed
            that jewelry could be more than decoration — it could be an extension of space, light,
            and line.
          </p>
          <LinkComponent
            route={{ path: "/about/our-story" }}
            className="inline-flex items-center gap-1 text-sm font-light text-foreground hover:text-foreground/80 transition-colors duration-200"
          >
            <span>Read our full story</span>
            <ArrowRight size={12} />
          </LinkComponent>
        </div>

        <div className="order-first md:order-last">
          <div className="w-full aspect-square overflow-hidden">
            <Image
              src={founders}
              alt="Linea founders - two women in minimalist jewelry"
              layout="fullWidth"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- FiftyFiftySection ---

interface FiftyFiftySectionProps {
  LinkComponent: LineaLinkComponent;
}

export function FiftyFiftySection({ LinkComponent }: FiftyFiftySectionProps) {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <LinkComponent route={{ path: "/category/earrings" }} className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <Image
                src={earringsCollection}
                alt="Earrings collection"
                layout="fullWidth"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </LinkComponent>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">Organic Forms</h3>
            <p className="text-sm font-light text-foreground">
              Nature-inspired pieces with fluid, sculptural details
            </p>
          </div>
        </div>

        <div>
          <LinkComponent route={{ path: "/category/bracelets" }} className="block">
            <div className="w-full aspect-square mb-3 overflow-hidden">
              <Image
                src={linkBracelet}
                alt="Chain link bracelet"
                layout="fullWidth"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </LinkComponent>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">Chain Collection</h3>
            <p className="text-sm font-light text-foreground">
              Refined links and connections in precious metals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- OneThirdTwoThirdsSection ---

interface OneThirdTwoThirdsSectionProps {
  LinkComponent: LineaLinkComponent;
}

export function OneThirdTwoThirdsSection({ LinkComponent }: OneThirdTwoThirdsSectionProps) {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LinkComponent route={{ path: "/category/rings" }} className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <Image
                src={organicEarring}
                alt="Artisan crafted jewelry"
                layout="fullWidth"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </LinkComponent>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">Artisan Craft</h3>
            <p className="text-sm font-light text-foreground">
              Handcrafted pieces with meticulous attention to detail
            </p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <LinkComponent route={{ path: "/category/necklaces" }} className="block">
            <div className="w-full h-[500px] lg:h-[800px] mb-3 overflow-hidden">
              <Image
                src={circularCollection}
                alt="Circular jewelry collection"
                layout="fullWidth"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </LinkComponent>
          <div className="">
            <h3 className="text-sm font-normal text-foreground mb-1">Circular Elements</h3>
            <p className="text-sm font-light text-foreground">
              Geometric perfection meets contemporary minimalism
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
