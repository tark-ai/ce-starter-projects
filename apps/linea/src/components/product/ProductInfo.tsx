import { useCheckout } from "@commercengine/checkout/react";
import type { Product } from "@commercengine/storefront-sdk";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
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

interface ProductInfoProps {
  product: Product;
  selectedVariantId: string | null;
  onVariantChange: (variantId: string) => void;
}

const ProductInfo = ({ product, selectedVariantId, onVariantChange }: ProductInfoProps) => {
  const { addToCart } = useCheckout();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const selectedVariant = product.has_variant
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;

  const displayPrice = selectedVariant?.pricing?.selling_price ?? product.pricing.selling_price;
  const displayCurrency = selectedVariant?.pricing?.currency ?? product.pricing.currency;
  const isInStock = selectedVariant ? selectedVariant.stock_available : product.stock_available;

  const categoryName = product.categories?.[0]?.name;
  const categorySlug = product.categories?.[0]?.slug;

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = async () => {
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
                    <Link to={`/category/${categorySlug}`}>{categoryName}</Link>
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
          {product.variant_options.map((option) => (
            <div key={option.key} className="space-y-2">
              <h3 className="text-sm font-light text-foreground">{option.name}</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => {
                  const optionValue = variant.associated_options?.[option.key];
                  if (!optionValue) return null;
                  const isColor = optionValue.type === "color";
                  const label = isColor ? optionValue.value.name : optionValue.value;
                  const isSelected = variant.id === selectedVariantId;

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => onVariantChange(variant.id)}
                      title={label}
                      className={`text-sm font-light border transition-colors ${
                        isColor ? "size-9 rounded-full p-0.5" : "px-4 py-2"
                      } ${
                        isSelected ? "border-foreground" : "border-border hover:border-foreground"
                      } ${!variant.stock_available ? "opacity-50" : ""}`}
                    >
                      {isColor ? (
                        <span
                          className="block size-full rounded-full"
                          style={{ backgroundColor: optionValue.value.hexcode }}
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
              <h3 className="text-sm font-light text-foreground">{attr.name}</h3>
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

        <Button
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
          onClick={handleAddToCart}
          disabled={!isInStock || adding}
        >
          {!isInStock ? "Out of Stock" : adding ? "Adding..." : "Add to Bag"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
