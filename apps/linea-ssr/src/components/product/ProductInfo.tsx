import { ProductInfo as SharedProductInfo } from "@ce/linea-shared/product";
import type { Product } from "@commercengine/storefront";
import { LineaLink } from "@/lib/linea-routing";
import { useWishlist } from "@/lib/wishlist";

interface ProductInfoProps {
  product: Product;
  selectedVariantId: string | null;
  selectedOptions: Record<string, string>;
  allOptionsSelected: boolean;
  onOptionChange: (optionKey: string, optionValue: string) => void;
}

const ProductInfo = ({
  product,
  selectedVariantId,
  selectedOptions,
  allOptionsSelected,
  onOptionChange,
}: ProductInfoProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <SharedProductInfo
      product={product}
      selectedVariantId={selectedVariantId}
      selectedOptions={selectedOptions}
      allOptionsSelected={allOptionsSelected}
      onOptionChange={onOptionChange}
      LinkComponent={LineaLink}
      isInWishlist={isInWishlist}
      onToggleWishlist={toggleWishlist}
    />
  );
};

export default ProductInfo;
