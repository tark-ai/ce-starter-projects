"use client";

import { useListSkus, useSimilarProducts } from "@/lib/hooks";
import ProductSection from "../category/ProductSection";

interface RelatedProductsProps {
  productId?: string;
  title?: string;
}

const RelatedProducts = ({ productId, title = "You might also like" }: RelatedProductsProps) => {
  const similar = useSimilarProducts(productId ?? "");
  const fallback = useListSkus({ limit: 4, enabled: !productId });
  const items = productId ? similar.items : fallback.skus;

  return <ProductSection title={title} items={items} />;
};

export default RelatedProducts;
