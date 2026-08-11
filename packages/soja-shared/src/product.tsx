import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ce/soja-ui/components/ui/accordion";
import { formatPrice } from "@ce/soja-ui/lib/format";
import { cn } from "@ce/soja-ui/lib/utils";
import { useCheckout } from "@commercengine/checkout/react";
import type { Item, Product, Variant, VariantOption } from "@commercengine/storefront";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { ProductCard, Reveal } from "./content";
import {
  type AttributeSpec,
  getProductTags,
  readAttributeText,
  type SojaProductDetail,
  splitDescription,
  toAttributeSpecs,
} from "./lib/product-meta";
import type { SojaLinkComponent } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";
import { getOptionSelectionValue, getVariantOption } from "./lib/variants";
import type { SojaWishlistControls } from "./lib/wishlist";
import { WishlistButton } from "./wishlist";

/* -------------------------------------------------------------------------- */
/* Gallery — sticky main image with a vertical thumbnail rail                   */
/* -------------------------------------------------------------------------- */

export interface ProductImageGalleryProps {
  images: Product["images"];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [active, setActive] = React.useState(0);
  const gallery = images ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: resetting on the images identity is the point
  React.useEffect(() => {
    setActive(0);
  }, [images]);

  if (gallery.length === 0) {
    return <div className="aspect-2/3 w-full bg-accent" />;
  }

  const current = gallery[Math.min(active, gallery.length - 1)];

  // min-w-0 throughout: flex and grid items default to `min-width: auto`, so
  // without it the thumbnail strip widens its ancestors instead of scrolling.
  return (
    <div className="flex min-w-0 flex-col gap-3 tablet:flex-row">
      <div className="min-w-0 flex-1 overflow-hidden bg-accent">
        <StorefrontImage
          key={active}
          image={current}
          alt={current?.alternate_text || productName}
          variant="zoom"
          loading="eager"
          className="aspect-2/3 w-full animate-fade-in object-cover"
        />
      </div>

      {gallery.length > 1 && (
        <div
          className={cn(
            "no-scrollbar flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto",
            "tablet:order-first tablet:w-20 tablet:shrink-0 tablet:flex-col",
            "tablet:snap-none tablet:overflow-x-visible"
          )}
        >
          {gallery.map((image, index) => (
            <button
              key={image.url_thumbnail ?? image.url_standard ?? index}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1} of ${gallery.length}`}
              aria-current={index === active}
              className={cn(
                "relative aspect-2/3 w-[4.5rem] shrink-0 snap-start overflow-hidden bg-accent transition-opacity duration-300 ease-soja tablet:w-full",
                index === active
                  ? "opacity-100 ring-1 ring-foreground ring-inset"
                  : "opacity-50 hover:opacity-80"
              )}
            >
              <StorefrontImage
                image={image}
                alt=""
                variant="thumbnail"
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* QuantityStepper                                                             */
/* -------------------------------------------------------------------------- */

function QuantityStepper({
  value,
  onChange,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}) {
  return (
    <div className="flex h-12 w-fit items-center border border-border">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="flex h-full w-11 items-center justify-center transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
      >
        <Minus className="h-3 w-3" strokeWidth={1.5} />
      </button>
      <span aria-live="polite" className="w-8 text-center text-meta">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-full w-11 items-center justify-center transition-opacity duration-300 ease-soja hover:opacity-60 disabled:pointer-events-none disabled:opacity-30"
      >
        <Plus className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ProductInfo                                                                 */
/* -------------------------------------------------------------------------- */

type OptionValue = {
  selectionValue: string;
  label: string;
  hexcode?: string;
  isPurchasable: boolean;
};

type OptionGroup = { option: VariantOption; values: OptionValue[] };

/** Backorder counts as purchasable: it sells now and ships when restocked. */
const isPurchasableStock = (entity: { stock_available: boolean; backorder?: boolean }): boolean =>
  entity.stock_available || Boolean(entity.backorder);

const isColorVariantOptionValue = (value: unknown): value is { name: string; hexcode: string } => {
  if (typeof value !== "object" || value === null) return false;
  const maybeColor = value as { name?: unknown; hexcode?: unknown };
  return typeof maybeColor.name === "string" && typeof maybeColor.hexcode === "string";
};

const getVariantOptionValues = (
  option: VariantOption
): Array<{ selectionValue: string; label: string; hexcode?: string }> => {
  const values: Array<{ selectionValue: string; label: string; hexcode?: string }> = [];
  const seen = new Set<string>();

  if (option.type === "color") {
    for (const rawValue of option.value) {
      if (!isColorVariantOptionValue(rawValue)) continue;
      if (seen.has(rawValue.name)) continue;
      seen.add(rawValue.name);
      values.push({
        selectionValue: rawValue.name,
        label: rawValue.name,
        hexcode: rawValue.hexcode,
      });
    }
    return values;
  }

  for (const rawValue of option.value) {
    if (typeof rawValue !== "string") continue;
    if (seen.has(rawValue)) continue;
    seen.add(rawValue);
    values.push({ selectionValue: rawValue, label: rawValue });
  }

  return values;
};

export interface ProductInfoProps {
  product: SojaProductDetail;
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  allOptionsSelected: boolean;
  onOptionChange: (optionKey: string, optionValue: string) => void;
  wishlist?: SojaWishlistControls;
  /** How many tags to surface before the row starts to crowd the column. */
  tagLimit?: number;
}

export function ProductInfo({
  product,
  selectedVariantId,
  selectedOptions,
  allOptionsSelected,
  onOptionChange,
  wishlist,
  tagLimit = 6,
}: ProductInfoProps) {
  const { addToCart } = useCheckout();
  const [adding, setAdding] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  const variants = product.variants ?? [];
  const selectedVariant = product.has_variant
    ? (variants.find((variant) => variant.id === selectedVariantId) ?? null)
    : null;

  const optionGroups = React.useMemo<OptionGroup[]>(() => {
    const variantOptions = product.has_variant ? (product.variant_options ?? []) : [];
    if (variantOptions.length === 0) return [];

    const productVariants = product.variants ?? [];
    const baseSelection = variantOptions.reduce<Record<string, string>>((acc, option) => {
      const value = selectedOptions[option.key];
      if (value) acc[option.key] = value;
      return acc;
    }, {});

    const matchesSelection = (variant: Variant, selection: Record<string, string>) =>
      Object.entries(selection).every(([key, expected]) => {
        const option = getVariantOption(variant, key);
        return option ? getOptionSelectionValue(option) === expected : false;
      });

    return variantOptions.map((option) => ({
      option,
      values: getVariantOptionValues(option).map((optionValue) => {
        const candidate = { ...baseSelection, [option.key]: optionValue.selectionValue };
        return {
          ...optionValue,
          isPurchasable: productVariants.some(
            (variant) => matchesSelection(variant, candidate) && isPurchasableStock(variant)
          ),
        };
      }),
    }));
  }, [product, selectedOptions]);

  const price = selectedVariant?.pricing?.selling_price ?? product.pricing.selling_price;
  const currency = selectedVariant?.pricing?.currency ?? product.pricing.currency;
  const compareAt = selectedVariant?.pricing?.listing_price ?? product.pricing.listing_price;
  const onSale = typeof compareAt === "number" && compareAt > price;

  // A variant product with no selection yet has no stock state to report — the
  // CTA asks for the choice instead of claiming the product is unavailable.
  const stockSource = product.has_variant ? selectedVariant : product;
  const hasCompleteSelection =
    !product.has_variant || (allOptionsSelected && Boolean(selectedVariant));
  const inStock = stockSource ? isPurchasableStock(stockSource) : false;
  const isBackorder = Boolean(stockSource && !stockSource.stock_available && stockSource.backorder);
  const canAddToCart = hasCompleteSelection && inStock && !adding;

  // The variant's own copy wins when it has any, then the product's, then the
  // opening paragraph of the long-form description (the rest goes in Details).
  const tagline =
    selectedVariant?.short_description ||
    product.short_description ||
    splitDescription(product.description).lede;

  const tags = getProductTags(product.tags, tagLimit);
  const sku = selectedVariant?.sku ?? product.sku;
  const wishlisted = wishlist?.isInWishlist(product.id, selectedVariantId) ?? false;

  const handleAddToCart = async () => {
    if (!canAddToCart) return;
    setAdding(true);
    try {
      await addToCart(product.id, selectedVariantId, quantity);
    } finally {
      setAdding(false);
    }
  };

  const ctaLabel = !hasCompleteSelection
    ? "Select an option"
    : !inStock
      ? "Out of stock"
      : adding
        ? "Adding…"
        : "Add to Cart";

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <h1 className="font-display text-[2rem] tracking-display tablet:text-display">
          {product.name}
        </h1>

        {selectedVariant && selectedVariant.name !== product.name && (
          <p className="text-meta text-muted-foreground">{selectedVariant.name}</p>
        )}

        {tagline && (
          <p className="max-w-[460px] text-meta leading-relaxed whitespace-pre-line text-foreground/75">
            {tagline}
          </p>
        )}

        <div className="flex items-baseline gap-3">
          <p className="font-display text-title tracking-display">{formatPrice(price, currency)}</p>
          {onSale && (
            <p className="text-meta text-muted-foreground line-through">
              {formatPrice(compareAt, currency)}
            </p>
          )}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-meta text-muted-foreground">
          {tags.map((tag) => (
            <span key={tag} className="capitalize">
              {tag}
            </span>
          ))}
        </div>
      )}

      {optionGroups.map((group) => (
        <fieldset key={group.option.key} className="flex flex-col gap-4">
          <legend className="text-meta text-muted-foreground">
            Select {group.option.name || group.option.key}
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const active = selectedOptions[group.option.key] === value.selectionValue;
              return (
                <button
                  key={value.selectionValue}
                  type="button"
                  onClick={() => onOptionChange(group.option.key, value.selectionValue)}
                  disabled={!value.isPurchasable}
                  aria-pressed={active}
                  className={cn(
                    "flex h-11 items-center gap-2 border px-5 text-meta transition-colors duration-300 ease-soja",
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground",
                    !value.isPurchasable &&
                      "pointer-events-none text-muted-foreground line-through opacity-40"
                  )}
                >
                  {value.hexcode && (
                    <span
                      aria-hidden
                      className="h-3 w-3 border border-black/10"
                      style={{ backgroundColor: value.hexcode }}
                    />
                  )}
                  {value.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="flex flex-col gap-5">
        {(hasCompleteSelection || sku) && (
          <p className="flex flex-wrap gap-x-3 text-meta text-muted-foreground">
            {hasCompleteSelection && (
              <span>{inStock ? (isBackorder ? "Made to order" : "In stock") : "Out of stock"}</span>
            )}
            {sku && <span>SKU {sku}</span>}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <QuantityStepper value={quantity} onChange={setQuantity} />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="h-12 flex-1 min-w-[200px] bg-primary px-8 text-meta text-primary-foreground transition-colors duration-300 ease-soja hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-40"
          >
            {ctaLabel}
          </button>
          {wishlist && (
            <WishlistButton
              active={wishlisted}
              onClick={() => wishlist.onToggleWishlist(product.id, selectedVariantId)}
              variant="control"
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DetailAccordions — Details / Specifications / Ingredients / Shipping         */
/* -------------------------------------------------------------------------- */

const INGREDIENT_KEYS = ["ingredients", "ingredient"];

const DEFAULT_SHIPPING_COPY =
  "All orders are shipped from Copenhagen. Complimentary international next-day shipping on all orders above €100. Business days are Monday to Friday, excluding public holidays. Unopened products may be returned within 30 days.";

export interface DetailAccordionsProps {
  product: SojaProductDetail;
  /** Falls back to brand-standard copy when the catalog has none. */
  shippingCopy?: string;
}

export function DetailAccordions({ product, shippingCopy }: DetailAccordionsProps) {
  const ingredients = readAttributeText(product.attributes, INGREDIENT_KEYS);
  const specs = toAttributeSpecs(product.attributes, INGREDIENT_KEYS);

  // ProductInfo already shows short_description — or, failing that, the first
  // paragraph of the long copy — as the tagline. Show whatever is left here so
  // the description is never dropped and never repeated.
  const { rest } = splitDescription(product.description);
  const detailBody = product.short_description ? (product.description ?? "").trim() : rest;

  return (
    <Accordion type="single" collapsible className="border-t border-border">
      {detailBody && (
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            <p className="whitespace-pre-line">{detailBody}</p>
          </AccordionContent>
        </AccordionItem>
      )}

      {specs.length > 0 && (
        <AccordionItem value="specifications">
          <AccordionTrigger>Specifications</AccordionTrigger>
          <AccordionContent>
            <AttributeSpecList specs={specs} />
          </AccordionContent>
        </AccordionItem>
      )}

      {ingredients && (
        <AccordionItem value="ingredients">
          <AccordionTrigger>Ingredients</AccordionTrigger>
          <AccordionContent>{ingredients}</AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping &amp; returns</AccordionTrigger>
        <AccordionContent>{shippingCopy ?? DEFAULT_SHIPPING_COPY}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

/** Colour attributes carry hexcodes, so they render as swatches, not words. */
export function AttributeSpecList({ specs }: { specs: AttributeSpec[] }) {
  if (specs.length === 0) return null;

  return (
    <dl className="grid gap-3">
      {specs.map((spec) => (
        <div key={spec.key} className="flex gap-3">
          <dt className="min-w-32 capitalize text-muted-foreground">{spec.name}</dt>
          <dd className="flex flex-wrap items-center gap-2">
            {spec.swatches.map((swatch) => (
              <span
                key={swatch.name}
                title={swatch.name}
                aria-hidden
                className="h-3 w-3 border border-black/10"
                style={{ backgroundColor: swatch.hexcode }}
              />
            ))}
            <span>{spec.value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* -------------------------------------------------------------------------- */
/* HowToUse — the lettered ritual block                                        */
/* -------------------------------------------------------------------------- */

export interface HowToUseStep {
  letter: string;
  text: string;
}

export const DEFAULT_HOW_TO_USE: HowToUseStep[] = [
  {
    letter: "A.",
    text: "Wet your face with warm water and towel dry softly to remove excess water.",
  },
  {
    letter: "B.",
    text: "Apply a chickpea-sized portion of the facial serum to your skin and spread evenly.",
  },
  {
    letter: "C.",
    text: "Rest, relax and let your face absorb the serum for up to six hours before removing with warm water.",
  },
];

export function HowToUse({ steps = DEFAULT_HOW_TO_USE }: { steps?: HowToUseStep[] }) {
  return (
    <section className="border-t border-border py-20 tablet:py-28">
      <div className="mx-auto w-full max-w-[var(--container-soja)] px-3">
        <Reveal>
          <h2 className="font-display text-title tracking-display">How to use</h2>
        </Reveal>
        <div className="mt-14 grid gap-12 tablet:grid-cols-3 tablet:gap-8">
          {steps.map((step, index) => (
            <Reveal
              key={step.letter}
              delay={index * 110}
              className={cn(
                "flex flex-col tablet:px-8",
                index > 0 && "tablet:border-l tablet:border-border",
                index === 0 && "tablet:pl-0"
              )}
            >
              <span className="text-meta text-muted-foreground">{step.letter}</span>
              <p className="mt-6 max-w-[280px] text-meta leading-relaxed">{step.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* RelatedProducts                                                             */
/* -------------------------------------------------------------------------- */

export interface RelatedProductsProps {
  items: Item[];
  LinkComponent: SojaLinkComponent;
  wishlist?: SojaWishlistControls;
  heading?: string;
}

export function RelatedProducts({
  items,
  LinkComponent,
  wishlist,
  heading = "You may also like",
}: RelatedProductsProps) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-border py-20 tablet:py-28">
      <div className="mx-auto w-full max-w-[var(--container-soja)] px-3">
        <Reveal>
          <h2 className="font-display text-title tracking-display">{heading}</h2>
        </Reveal>
      </div>
      <div className="mt-14 grid w-full grid-cols-2 gap-3 px-3 tablet:grid-cols-4">
        {items.slice(0, 4).map((item, index) => (
          <Reveal key={`${item.product_id}-${item.variant_id ?? index}`} delay={index * 90}>
            <ProductCard item={item} LinkComponent={LinkComponent} wishlist={wishlist} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
