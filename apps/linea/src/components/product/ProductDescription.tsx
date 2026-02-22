import type { Product } from "@commercengine/storefront-sdk";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReviewProduct from "./ReviewProduct";

interface ProductDescriptionProps {
  product: Product;
}

const CustomStar = ({ filled, className }: { filled: boolean; className?: string }) => (
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

const ProductDescription = ({ product }: ProductDescriptionProps) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCareOpen, setIsCareOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const averageRating =
    product.reviews_count > 0 ? product.reviews_rating_sum / product.reviews_count : 0;

  return (
    <div className="space-y-0 mt-8 border-t border-border">
      {/* Description */}
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

      {/* Product Details */}
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
                <span className="text-sm font-light text-muted-foreground">{attr.name}</span>
                <span className="text-sm font-light text-foreground">{String(attr.value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Care Instructions */}
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

      {/* Customer Reviews */}
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
                  <CustomStar key={star} filled={star <= Math.round(averageRating)} />
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
};

export default ProductDescription;
