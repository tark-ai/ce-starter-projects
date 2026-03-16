import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ce/ui/components/ui/breadcrumb";
import { Button } from "@ce/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ce/ui/components/ui/dialog";
import { Textarea } from "@ce/ui/components/ui/textarea";
import { formatPrice } from "@ce/ui/lib/format";
import { useCheckout } from "@commercengine/checkout/react";
import type { Product, ProductImage, VariantOption } from "@commercengine/storefront";
import { ChevronDown, ChevronUp, Heart, Minus, Plus, X } from "lucide-react";
import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LineaLinkComponent } from "./lib/routing";
import { StorefrontImage } from "./lib/storefront-image";
import { getOptionSelectionValue, getVariantOption } from "./lib/variants";

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
      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className={`w-4 h-4 transition-colors ${active ? "text-red-500" : "text-foreground/70 hover:text-foreground"}`}
        role="img"
        aria-label="Heart icon"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

interface ProductInfoProps {
  product: Product;
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  allOptionsSelected: boolean;
  onOptionChange: (optionKey: string, optionValue: string) => void;
  LinkComponent: LineaLinkComponent;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  onToggleWishlist: (productId: string, variantId?: string | null) => void;
}

type OptionGroup = {
  option: VariantOption;
  values: Array<{
    selectionValue: string;
    label: string;
    hexcode?: string;
    isPurchasable: boolean;
  }>;
};

const isVariantPurchasable = (variant: Product["variants"][number]): boolean => {
  return variant.stock_available || Boolean(variant.backorder);
};

const isColorVariantOptionValue = (
  value: unknown
): value is {
  name: string;
  hexcode: string;
} => {
  if (typeof value !== "object" || value === null) return false;

  const maybeColor = value as { name?: unknown; hexcode?: unknown };
  return typeof maybeColor.name === "string" && typeof maybeColor.hexcode === "string";
};

const getVariantOptionValues = (
  option: VariantOption
): Array<{
  selectionValue: string;
  label: string;
  hexcode?: string;
}> => {
  const values: Array<{
    selectionValue: string;
    label: string;
    hexcode?: string;
  }> = [];
  const seen = new Set<string>();

  if (option.type === "color") {
    for (const rawValue of option.value) {
      if (!isColorVariantOptionValue(rawValue)) continue;
      const selectionValue = rawValue.name;
      if (seen.has(selectionValue)) continue;

      seen.add(selectionValue);
      values.push({
        selectionValue,
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
    values.push({
      selectionValue: rawValue,
      label: rawValue,
    });
  }

  return values;
};

export function ProductInfo({
  product,
  selectedVariantId,
  selectedOptions,
  allOptionsSelected,
  onOptionChange,
  LinkComponent,
  isInWishlist,
  onToggleWishlist,
}: ProductInfoProps) {
  const { addToCart } = useCheckout();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const wishlisted = isInWishlist(product.id, selectedVariantId);

  const selectedVariant = product.has_variant
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;

  const optionGroups = useMemo(() => {
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
    ) => {
      return Object.entries(selection).every(([key, expectedValue]) => {
        const option = getVariantOption(variant, key);
        return option ? getOptionSelectionValue(option) === expectedValue : false;
      });
    };

    const groups: OptionGroup[] = product.variant_options.map((option) => {
      const resolvedValues = getVariantOptionValues(option).map((optionValue) => {
        const candidateSelection = {
          ...baseSelection,
          [option.key]: optionValue.selectionValue,
        };
        const isPurchasable = product.variants.some((variant) => {
          return matchesSelection(variant, candidateSelection) && isVariantPurchasable(variant);
        });

        return {
          selectionValue: optionValue.selectionValue,
          label: optionValue.label,
          hexcode: optionValue.hexcode,
          isPurchasable,
        };
      });

      return {
        option,
        values: resolvedValues,
      };
    });

    return groups;
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

  const categoryName = product.categories?.[0]?.name;
  const categorySlug = product.categories?.[0]?.slug;

  const handleAddToCart = async () => {
    if (product.has_variant && !selectedVariantId) return;

    setAdding(true);
    try {
      await addToCart(product.id, selectedVariantId, quantity);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <LinkComponent route={{ path: "/" }}>Home</LinkComponent>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {categoryName && categorySlug && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <LinkComponent route={{ path: `/category/${categorySlug}` }}>
                      {categoryName}
                    </LinkComponent>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            {categoryName && (
              <p className="text-sm font-light text-muted-foreground mb-1">{categoryName}</p>
            )}
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">
              {formatPrice(displayPrice, displayCurrency)}
            </p>
          </div>
        </div>
      </div>

      {product.has_variant && product.variant_options && (
        <div className="space-y-4 py-4 border-b border-border">
          {optionGroups.map(({ option, values }) => (
            <div key={option.key} className="space-y-2">
              <h3 className="text-sm font-light text-foreground capitalize">{option.name}</h3>
              <div className="flex flex-wrap gap-2">
                {values.map(({ selectionValue, label, hexcode, isPurchasable }) => {
                  const isColor = option.type === "color";
                  const isSelected = selectedOptions[option.key] === selectionValue;

                  return (
                    <button
                      key={`${option.key}-${selectionValue}`}
                      type="button"
                      onClick={() => onOptionChange(option.key, selectionValue)}
                      aria-disabled={!isPurchasable}
                      disabled={!isPurchasable}
                      title={label}
                      className={`text-sm font-light border transition-colors ${
                        isColor ? "size-9 rounded-full p-0.5" : "px-4 py-2"
                      } ${
                        isSelected ? "border-foreground" : "border-border hover:border-foreground"
                      } ${!isPurchasable ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {isColor ? (
                        <span
                          className="block size-full rounded-full"
                          style={{ backgroundColor: hexcode }}
                        />
                      ) : (
                        label
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {product.attributes.length > 0 && (
        <div className="space-y-4 py-4 border-b border-border">
          {product.attributes.map((attr) => (
            <div key={attr.key} className="space-y-2">
              <h3 className="text-sm font-light text-foreground capitalize">{attr.name}</h3>
              <p className="text-sm font-light text-muted-foreground">{String(attr.value)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity((prev) => prev + 1)}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1 h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
          >
            {!hasCompleteVariantSelection
              ? "Select options"
              : !isPurchasable
                ? "Out of Stock"
                : adding
                  ? "Adding..."
                  : "Add to Bag"}
          </Button>
          <Button
            variant="outline"
            className="h-12 w-12 shrink-0 rounded-none border-border hover:bg-transparent"
            onClick={() => onToggleWishlist(product.id, selectedVariantId)}
            aria-label={wishlisted ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${wishlisted ? "fill-red-500 text-red-500" : "text-foreground"}`}
            />
          </Button>
        </div>
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
      if (event.key === "Escape") {
        onClose();
      }
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
      if (imageElement) {
        imageElement.scrollIntoView();
      }
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
        className="absolute top-6 right-6 z-10 hover:bg-transparent text-black border-none p-2"
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
                className="w-full max-w-none object-cover animate-scale-in"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- ProductImageGallery ---

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomInitialIndex, setZoomInitialIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleImageClick = (index: number) => {
    setZoomInitialIndex(index);
    setIsZoomOpen(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const difference = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(difference) > minSwipeDistance) {
      if (difference > 0) {
        nextImage();
      } else {
        prevImage();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (images.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted/10 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No images</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop: Vertical scrolling gallery */}
      <div className="hidden lg:block">
        <div className="space-y-4">
          {images.map((image, index) => {
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(index);
              }
            };
            return (
              <button
                key={image.id}
                type="button"
                className="w-full aspect-square overflow-hidden cursor-pointer group border-0 p-0 bg-transparent"
                onClick={() => handleImageClick(index)}
                onKeyDown={handleKeyDown}
                aria-label={`View ${productName} image ${index + 1}`}
              >
                <StorefrontImage
                  image={image}
                  alt={image.alternate_text || `${productName} view ${index + 1}`}
                  variant="standard"
                  width={800}
                  height={800}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : undefined}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Tablet/Mobile: Image slider */}
      <div className="lg:hidden">
        <div className="relative">
          <button
            type="button"
            className="w-full aspect-square overflow-hidden cursor-pointer group touch-pan-y border-0 p-0 bg-transparent"
            onClick={() => handleImageClick(currentImageIndex)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(currentImageIndex);
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-label={`View ${productName} image ${currentImageIndex + 1}`}
          >
            <StorefrontImage
              image={images[currentImageIndex]}
              alt={
                images[currentImageIndex].alternate_text ||
                `${productName} view ${currentImageIndex + 1}`
              }
              variant="standard"
              width={800}
              height={800}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
            />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-4 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? "bg-foreground" : "bg-muted"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <ImageZoom
        images={images}
        initialIndex={zoomInitialIndex}
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
      />
    </div>
  );
}

// --- ReviewProduct ---

const ReviewStar = ({
  filled,
  onClick,
  className,
}: {
  filled: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`cursor-pointer ${className}`}
    aria-label={filled ? "Filled star" : "Empty star"}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={`w-5 h-5 ${filled ? "text-foreground" : "text-muted-foreground/30"}`}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
        clipRule="evenodd"
      />
    </svg>
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
        <Button
          variant="outline"
          className="w-full h-12 font-light rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background"
        >
          Review product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md !rounded-none">
        <DialogHeader>
          <DialogTitle className="font-light text-xl">Review product</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <label htmlFor="rating" className="text-sm font-light text-foreground">
              Rating
            </label>
            <div className="flex items-center gap-1" id="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <ReviewStar key={star} filled={star <= rating} onClick={() => setRating(star)} />
              ))}
            </div>
          </fieldset>

          <div className="space-y-3">
            <label htmlFor="review-textarea" className="text-sm font-light text-foreground">
              Your review
            </label>
            <Textarea
              id="review-textarea"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="min-h-24 resize-none rounded-none font-light"
            />
          </div>

          <Button
            onClick={submitReview}
            disabled={rating === 0 || review.trim() === ""}
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
          >
            Submit review
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- ProductDescription ---

const DescriptionStar = ({ filled, className }: { filled: boolean; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-3 h-3 ${filled ? "text-foreground" : "text-muted-foreground/30"} ${className}`}
    role="img"
    aria-label={filled ? "Filled star" : "Empty star"}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
      clipRule="evenodd"
    />
  </svg>
);

interface ProductDescriptionProps {
  product: Product;
}

export function ProductDescription({ product }: ProductDescriptionProps) {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const averageRating =
    product.reviews_count > 0 ? product.reviews_rating_sum / product.reviews_count : 0;

  return (
    <div className="space-y-0 mt-8 border-t border-border">
      {product.short_description && (
        <div className="border-b border-border">
          <Button
            variant="ghost"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
          >
            <span>Description</span>
            {isDescriptionOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {isDescriptionOpen && (
            <div className="pb-6 space-y-4">
              <p className="text-sm font-light text-muted-foreground leading-relaxed">
                {product.short_description}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsDetailsOpen(!isDetailsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Product Details</span>
          {isDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isDetailsOpen && (
          <div className="pb-6 space-y-3">
            {product.sku && (
              <div className="flex justify-between">
                <span className="text-sm font-light text-muted-foreground">SKU</span>
                <span className="text-sm font-light text-foreground">{product.sku}</span>
              </div>
            )}
            {product.attributes.map((attr) => (
              <div key={attr.key} className="flex justify-between">
                <span className="text-sm font-light text-muted-foreground capitalize">
                  {attr.name}
                </span>
                <span className="text-sm font-light text-foreground">{String(attr.value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-b border-border">
        <Button
          variant="ghost"
          onClick={() => setIsCareOpen(!isCareOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <span>Care & Cleaning</span>
          {isCareOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isCareOpen && (
          <div className="pb-6 space-y-4">
            <ul className="space-y-2">
              <li className="text-sm font-light text-muted-foreground">
                - Clean with a soft, dry cloth after each wear
              </li>
              <li className="text-sm font-light text-muted-foreground">
                - Avoid contact with perfumes, lotions, and cleaning products
              </li>
              <li className="text-sm font-light text-muted-foreground">
                - Store in the provided jewelry pouch when not wearing
              </li>
              <li className="text-sm font-light text-muted-foreground">
                - Remove before swimming, exercising, or showering
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="border-b border-border lg:mb-16">
        <Button
          variant="ghost"
          onClick={() => setIsReviewsOpen(!isReviewsOpen)}
          className="w-full h-14 px-0 justify-between hover:bg-transparent font-light rounded-none"
        >
          <div className="flex items-center gap-3">
            <span>Customer Reviews</span>
            {product.reviews_count > 0 && (
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <DescriptionStar key={star} filled={star <= Math.round(averageRating)} />
                ))}
                <span className="text-sm font-light text-muted-foreground ml-1">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          {isReviewsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {isReviewsOpen && (
          <div className="pb-6 space-y-6">
            <ReviewProduct />
            {product.reviews_count === 0 && (
              <p className="text-sm font-light text-muted-foreground">
                No reviews yet. Be the first to review this product.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
