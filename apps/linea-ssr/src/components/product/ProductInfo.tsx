import { useCheckout } from "@commercengine/checkout/react";
import type { Product, VariantOption } from "@commercengine/storefront-sdk";
import { Link } from "@tanstack/react-router";
import { Heart, Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { getOptionSelectionValue, getVariantOption } from "@/lib/variants";
import { useWishlist } from "@/lib/wishlist";

interface ProductInfoProps {
  product: Product;
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  allOptionsSelected: boolean;
  onOptionChange: (optionKey: string, optionValue: string) => void;
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

const ProductInfo = ({
  product,
  selectedVariantId,
  selectedOptions,
  allOptionsSelected,
  onOptionChange,
}: ProductInfoProps) => {
  const { addToCart } = useCheckout();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const wishlisted = isInWishlist(product.id);

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

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

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
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {categoryName && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/category/$category" params={{ category: categorySlug! }}>
                      {categoryName}
                    </Link>
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

      {/* Product title and price */}
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

      {/* Variant selector */}
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

      {/* Product attributes */}
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

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
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
              onClick={incrementQuantity}
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
            onClick={() => toggleWishlist(product.id, selectedVariantId)}
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
};

export default ProductInfo;
