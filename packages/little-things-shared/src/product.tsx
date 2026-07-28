import { Button } from "@ce/little-things-ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ce/little-things-ui/components/ui/dialog";
import { Textarea } from "@ce/little-things-ui/components/ui/textarea";
import { formatPrice } from "@ce/little-things-ui/lib/format";
import { useCheckout } from "@commercengine/checkout/react";
import type { Product, ProductImage, VariantOption } from "@commercengine/storefront";
import { Check, Heart, Star, X } from "lucide-react";
import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LittleThingsLinkComponent } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";
import { getOptionSelectionValue, getVariantOption } from "./lib/variants";

// --- WishlistButton ---

export interface WishlistButtonProps {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

export function WishlistButton({ active, onClick, className = "" }: WishlistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full bg-background/85 backdrop-blur-sm shadow-sm hover:bg-background transition-colors ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`size-4 transition-colors ${
          active ? "fill-brand text-brand" : "text-foreground/70 hover:text-foreground"
        }`}
      />
    </button>
  );
}

// --- ProductInfo ---

interface ProductInfoProps {
  product: Product;
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  allOptionsSelected: boolean;
  onOptionChange: (optionKey: string, optionValue: string) => void;
  LinkComponent: LittleThingsLinkComponent;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
}

type OptionValue = {
  selectionValue: string;
  label: string;
  hexcode?: string;
  isPurchasable: boolean;
};

type OptionGroup = {
  option: VariantOption;
  values: OptionValue[];
};

const isVariantPurchasable = (variant: Product["variants"][number]): boolean => {
  return variant.stock_available || Boolean(variant.backorder);
};

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

export function ProductInfo({
  product,
  selectedVariantId,
  selectedOptions,
  allOptionsSelected,
  onOptionChange,
  isInWishlist,
  onToggleWishlist,
}: ProductInfoProps) {
  const { addToCart } = useCheckout();
  const [adding, setAdding] = useState(false);
  const wishlisted = isInWishlist(product.id, selectedVariantId);

  const selectedVariant = product.has_variant
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;

  const optionGroups = useMemo<OptionGroup[]>(() => {
    if (!product.has_variant || !product.variant_options) return [];

    const optionKeys = product.variant_options.map((option) => option.key);
    const baseSelection = optionKeys.reduce<Record<string, string>>((acc, key) => {
      const value = selectedOptions[key];
      if (value) acc[key] = value;
      return acc;
    }, {});

    const matchesSelection = (
      variant: Product["variants"][number],
      selection: Record<string, string>
    ) =>
      Object.entries(selection).every(([key, expectedValue]) => {
        const option = getVariantOption(variant, key);
        return option ? getOptionSelectionValue(option) === expectedValue : false;
      });

    return product.variant_options.map((option) => ({
      option,
      values: getVariantOptionValues(option).map((optionValue) => {
        const candidate = { ...baseSelection, [option.key]: optionValue.selectionValue };
        const isPurchasable = product.variants.some(
          (variant) => matchesSelection(variant, candidate) && isVariantPurchasable(variant)
        );
        return { ...optionValue, isPurchasable };
      }),
    }));
  }, [product, selectedOptions]);

  const displayPrice = selectedVariant?.pricing?.selling_price ?? product.pricing.selling_price;
  const displayCurrency = selectedVariant?.pricing?.currency ?? product.pricing.currency;

  const hasCompleteVariantSelection =
    !product.has_variant || (allOptionsSelected && !!selectedVariant);
  const isPurchasable = product.has_variant
    ? selectedVariant
      ? isVariantPurchasable(selectedVariant)
      : false
    : product.stock_available || Boolean(product.backorder);
  const canAddToCart = hasCompleteVariantSelection && isPurchasable && !adding;

  // Tag row (e.g. "Desktop  Accessories  Season") — categories + tags, deduped.
  const tagRow = Array.from(
    new Set([
      ...(product.categories?.map((c) => c.name) ?? []),
      ...((product.tags ?? []) as string[]),
    ])
  ).slice(0, 4);

  const description = product.short_description || "";

  const handleAddToCart = async () => {
    if (product.has_variant && !selectedVariantId) return;
    setAdding(true);
    try {
      await addToCart(product.id, selectedVariantId, 1);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title + price */}
      <div className="flex items-start justify-between gap-6">
        <h1 className="font-display text-4xl italic leading-tight text-foreground md:text-5xl">
          {product.name}
        </h1>
        <p className="shrink-0 font-display text-3xl italic text-brand md:text-4xl">
          {formatPrice(displayPrice, displayCurrency)}
        </p>
      </div>

      {description && (
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      )}

      {tagRow.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {tagRow.map((tag) => (
            <span key={tag} className="capitalize">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Variant option selectors (color swatches / option pills) */}
      {product.has_variant && optionGroups.length > 0 && (
        <div className="space-y-5 pt-2">
          {optionGroups.map(({ option, values }) => {
            const isColor = option.type === "color";
            const selectedValue = selectedOptions[option.key];

            return (
              <div key={option.key} className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium capitalize text-foreground">{option.name}</span>
                  {selectedValue && (
                    <span className="capitalize text-muted-foreground">{selectedValue}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {values.map(({ selectionValue, label, hexcode, isPurchasable: purchasable }) => {
                    const isSelected = selectedValue === selectionValue;
                    if (isColor) {
                      return (
                        <button
                          key={`${option.key}-${selectionValue}`}
                          type="button"
                          onClick={() => onOptionChange(option.key, selectionValue)}
                          disabled={!purchasable}
                          title={label}
                          aria-pressed={isSelected}
                          className={`grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-background transition-all ${
                            isSelected
                              ? "ring-2 ring-foreground"
                              : "ring-1 ring-border hover:ring-foreground/40"
                          } ${!purchasable ? "cursor-not-allowed opacity-40" : ""}`}
                        >
                          <span
                            className="block size-7 rounded-full border border-black/10"
                            style={{ backgroundColor: hexcode }}
                          />
                        </button>
                      );
                    }
                    return (
                      <button
                        key={`${option.key}-${selectionValue}`}
                        type="button"
                        onClick={() => onOptionChange(option.key, selectionValue)}
                        disabled={!purchasable}
                        aria-pressed={isSelected}
                        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-foreground hover:border-foreground"
                        } ${!purchasable ? "cursor-not-allowed opacity-40" : ""}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Purchase + wishlist */}
      <div className="flex items-center gap-3 pt-2">
        <Button size="lg" className="px-10" onClick={handleAddToCart} disabled={!canAddToCart}>
          {!hasCompleteVariantSelection
            ? "Select options"
            : !isPurchasable
              ? "Out of stock"
              : adding
                ? "Adding..."
                : "Purchase"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => onToggleWishlist(product.id, selectedVariantId)}
          aria-label={wishlisted ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`size-5 ${wishlisted ? "fill-brand text-brand" : "text-foreground"}`} />
        </Button>
      </div>
    </div>
  );
}

// --- ImageZoom ---

interface ImageZoomProps {
  images: ProductImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageZoom({ images, initialIndex, isOpen, onClose }: ImageZoomProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      const imageElement = scrollRef.current.children[0]?.children[initialIndex] as HTMLElement;
      if (imageElement) imageElement.scrollIntoView();
    }
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const handleBackdropKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm animate-fade-in">
      <button
        type="button"
        className="absolute inset-0 border-0 p-0 cursor-pointer bg-transparent"
        onClick={onClose}
        onKeyDown={handleBackdropKeyDown}
        aria-label="Close image zoom"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="absolute top-6 right-6 z-10 hover:bg-transparent text-white border-none p-2"
      >
        <X className="h-8 w-8" />
      </Button>
      <div ref={scrollRef} className="relative w-full h-full overflow-y-auto">
        <div className="space-y-4">
          {images.map((image) => (
            <div key={image.id} className="w-full flex justify-center">
              <StorefrontImage
                image={image}
                alt={image.alternate_text || "Product view"}
                variant="zoom"
                width={1200}
                height={1200}
                className="w-full max-w-3xl object-contain animate-scale-in"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ProductImageGallery (vertical thumbnails + large main image) ---

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-secondary">
        <p className="text-sm text-muted-foreground">No image</p>
      </div>
    );
  }

  const activeImage = images[currentImageIndex] ?? images[0];

  return (
    <div className="w-full">
      <div className="flex gap-4">
        {/* Vertical thumbnail column (desktop) */}
        {images.length > 1 && (
          <div className="hidden w-20 shrink-0 flex-col gap-3 lg:flex">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={`flex aspect-square items-center justify-center overflow-hidden bg-secondary p-2 transition-all ${
                  index === currentImageIndex ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"
                }`}
                aria-label={`Show ${productName} image ${index + 1}`}
              >
                <StorefrontImage
                  image={image}
                  alt={image.alternate_text || `${productName} thumbnail ${index + 1}`}
                  variant="thumbnail"
                  width={120}
                  height={120}
                  className="h-full w-full object-contain"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <button
          type="button"
          className="group flex aspect-square flex-1 items-center justify-center overflow-hidden border-0 bg-secondary p-3 md:p-4"
          onClick={() => setIsZoomOpen(true)}
          aria-label={`Zoom ${productName}`}
        >
          <StorefrontImage
            image={activeImage}
            alt={activeImage.alternate_text || productName}
            variant="standard"
            width={900}
            height={900}
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </button>
      </div>

      {/* Mobile: horizontal thumbnail strip below the main image */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto px-1 py-1 lg:hidden">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setCurrentImageIndex(index)}
              className={`flex size-16 shrink-0 items-center justify-center overflow-hidden bg-secondary p-1.5 transition-all ${
                index === currentImageIndex ? "ring-2 ring-brand" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Show ${productName} image ${index + 1}`}
            >
              <StorefrontImage
                image={image}
                alt={image.alternate_text || `${productName} thumbnail ${index + 1}`}
                variant="thumbnail"
                width={96}
                height={96}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}

      <ImageZoom
        images={images}
        initialIndex={currentImageIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
}

// --- ReviewProduct ---

const ReviewStar = ({ filled, onClick }: { filled: boolean; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="cursor-pointer"
    aria-label={filled ? "Filled star" : "Empty star"}
  >
    <Star className={`h-6 w-6 ${filled ? "fill-brand text-brand" : "text-muted-foreground/40"}`} />
  </button>
);

export function ReviewProduct() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const submitReview = () => {
    setIsOpen(false);
    setRating(0);
    setReview("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl italic">Tell us what you think</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <span className="text-sm font-medium text-foreground">Rating</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <ReviewStar key={star} filled={star <= rating} onClick={() => setRating(star)} />
              ))}
            </div>
          </fieldset>
          <div className="space-y-3">
            <label htmlFor="review-textarea" className="text-sm font-medium text-foreground">
              Your review
            </label>
            <Textarea
              id="review-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="No pressure, but the good ones get read out loud in the office."
              className="min-h-24 resize-none font-light"
            />
          </div>
          <Button
            onClick={submitReview}
            disabled={rating === 0 || review.trim() === ""}
            className="w-full h-12"
          >
            Submit review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- DetailTabs (Details / Shipping / Returns / Reviews) ---

type DetailTabKey = "details" | "shipping" | "returns" | "reviews";

const DETAIL_TABS: Array<{ key: DetailTabKey; label: string }> = [
  { key: "details", label: "Details" },
  { key: "shipping", label: "Shipping" },
  { key: "returns", label: "Returns" },
  { key: "reviews", label: "Reviews" },
];

interface DetailTabsProps {
  product: Product;
}

export function DetailTabs({ product }: DetailTabsProps) {
  const [activeTab, setActiveTab] = useState<DetailTabKey>("details");

  const averageRating =
    product.reviews_count > 0 ? (product.reviews_rating_sum ?? 0) / product.reviews_count : 0;

  const featureBullets = product.attributes.map((attr) => `${attr.name}: ${String(attr.value)}`);

  return (
    <section className="border-t border-border pt-6">
      <div className="flex gap-8 border-b border-border">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`-mb-px border-b-2 pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8 text-sm leading-relaxed text-muted-foreground">
        {activeTab === "details" && (
          <div className="space-y-5">
            <p>
              {product.short_description ||
                "This product is crafted from high-quality materials designed for durability and comfort. It features modern design elements and is perfect for everyday use."}
            </p>
            {featureBullets.length > 0 && (
              <ul className="space-y-2.5">
                {featureBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 text-foreground">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                    <span className="capitalize">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-3">
            <p>
              Free standard shipping on all orders above $50. We pack it, we ship it, you refresh
              the tracking page way too many times.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Standard shipping: 2-5 business days.</li>
              <li>Express shipping available at checkout.</li>
              <li>Tracking emailed the moment it leaves the building.</li>
            </ul>
          </div>
        )}

        {activeTab === "returns" && (
          <div className="space-y-3">
            <p>
              Changed your mind? You've got 30 days from purchase to send it back, no interrogation
              required.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>30-day returns on unused items in original packaging.</li>
              <li>Refunds land back on your card within 5-7 business days.</li>
            </ul>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {product.reviews_count > 0 ? (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(averageRating)
                            ? "fill-brand text-brand"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-muted-foreground">
                      {averageRating.toFixed(1)} ({product.reviews_count})
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the hero this product deserves.
                  </p>
                )}
              </div>
              <ReviewProduct />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// --- ProductDescription (kept for compatibility; not used on the reference PDP) ---

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  if (!product.short_description && product.attributes.length === 0) return null;

  return (
    <div className="mt-8 max-w-none">
      {product.short_description && (
        <p className="text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
      )}
      {product.attributes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {product.attributes.map((attr) => (
            <li key={attr.key} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              <span>
                <span className="capitalize text-muted-foreground">{attr.name}:</span>{" "}
                {String(attr.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
