"use client";

import {
  findVariantBySelection,
  getDefaultVariant,
  getVariantOptionSelection,
  hasAllOptionsSelected,
  optionQueryParamKey,
} from "@ce/little-things-shared/lib/variants";
import type { Product } from "@commercengine/storefront";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import DetailTabs from "@/components/product/DetailTabs";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { useProductDetail } from "@/lib/hooks";

interface ProductContentProps {
  serverProduct?: Product;
}

export function ProductContent({ serverProduct }: ProductContentProps) {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientDetail = useProductDetail(slug || "", { enabled: !serverProduct });
  const product = serverProduct ?? clientDetail.product;
  const isLoading = serverProduct ? false : clientDetail.isLoading;

  const optionKeys = useMemo(() => {
    if (!product?.has_variant || !product.variant_options) return [];
    return product.variant_options.map((option) => option.key);
  }, [product]);

  const selectedOptions = useMemo(() => {
    const selection: Record<string, string> = {};
    for (const optionKey of optionKeys) {
      const value = searchParams.get(optionQueryParamKey(optionKey));
      if (value) selection[optionKey] = value;
    }
    return selection;
  }, [optionKeys, searchParams]);

  const allOptionsSelected = useMemo(() => {
    if (!product?.has_variant) return false;
    if (optionKeys.length === 0) return true;
    return hasAllOptionsSelected(optionKeys, selectedOptions);
  }, [product, optionKeys, selectedOptions]);

  const variantFromUrl = useMemo(() => {
    if (!product?.has_variant) return null;
    const variantSlug = searchParams.get("variant");
    if (!variantSlug) return null;
    return product.variants.find((variant) => variant.slug === variantSlug) ?? null;
  }, [product, searchParams]);

  const selectedVariant = useMemo(() => {
    if (!product?.has_variant) return null;
    if (optionKeys.length === 0) {
      return variantFromUrl ?? getDefaultVariant(product);
    }
    return findVariantBySelection(product.variants, optionKeys, selectedOptions);
  }, [product, optionKeys, selectedOptions, variantFromUrl]);

  useEffect(() => {
    if (!product?.has_variant) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    let changed = false;

    const hasAnyOptionParam = optionKeys.some((key) => nextParams.has(optionQueryParamKey(key)));

    if (optionKeys.length === 0) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant && nextParams.get("variant") !== bootstrapVariant.slug) {
        nextParams.set("variant", bootstrapVariant.slug);
        changed = true;
      }
      if (changed) {
        router.replace(`/product/${slug}?${nextParams.toString()}`);
      }
      return;
    }

    if (!hasAnyOptionParam) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant) {
        const defaultSelection = getVariantOptionSelection(bootstrapVariant, optionKeys);
        for (const optionKey of optionKeys) {
          const value = defaultSelection[optionKey];
          if (!value) continue;
          const queryKey = optionQueryParamKey(optionKey);
          if (nextParams.get(queryKey) !== value) {
            nextParams.set(queryKey, value);
            changed = true;
          }
        }
        if (nextParams.get("variant") !== bootstrapVariant.slug) {
          nextParams.set("variant", bootstrapVariant.slug);
          changed = true;
        }
      }
    } else if (selectedVariant) {
      if (nextParams.get("variant") !== selectedVariant.slug) {
        nextParams.set("variant", selectedVariant.slug);
        changed = true;
      }
    } else if (variantFromUrl) {
      const variantSelection = getVariantOptionSelection(variantFromUrl, optionKeys);
      let filledMissingOption = false;

      for (const optionKey of optionKeys) {
        const queryKey = optionQueryParamKey(optionKey);
        if (nextParams.has(queryKey)) continue;

        const value = variantSelection[optionKey];
        if (!value) continue;

        nextParams.set(queryKey, value);
        changed = true;
        filledMissingOption = true;
      }

      if (!filledMissingOption && nextParams.has("variant")) {
        nextParams.delete("variant");
        changed = true;
      }
    } else if (nextParams.has("variant")) {
      nextParams.delete("variant");
      changed = true;
    }

    if (changed) {
      router.replace(`/product/${slug}?${nextParams.toString()}`);
    }
  }, [product, searchParams, router, slug, optionKeys, variantFromUrl, selectedVariant]);

  const handleOptionChange = useCallback(
    (optionKey: string, optionValue: string) => {
      if (!product?.has_variant) return;

      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set(optionQueryParamKey(optionKey), optionValue);

      const nextSelection: Record<string, string> = {};
      for (const key of optionKeys) {
        const value = nextParams.get(optionQueryParamKey(key));
        if (value) nextSelection[key] = value;
      }

      const matchedVariant = findVariantBySelection(product.variants, optionKeys, nextSelection);
      if (matchedVariant) {
        nextParams.set("variant", matchedVariant.slug);
      } else {
        nextParams.delete("variant");
      }

      router.replace(`/product/${slug}?${nextParams.toString()}`);
    },
    [product, searchParams, router, slug, optionKeys]
  );

  const displayImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1400px] px-6 pt-6 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="aspect-square bg-muted/20 animate-pulse rounded-lg" />
          <div className="lg:pl-12 mt-8 lg:mt-0 space-y-4">
            <div className="h-4 w-24 bg-muted/20 animate-pulse" />
            <div className="h-8 w-48 bg-muted/20 animate-pulse" />
            <div className="h-6 w-20 bg-muted/20 animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-[1400px] px-6 pt-6 lg:px-20 text-center py-24">
        <p className="text-sm font-light text-muted-foreground">
          Product not found. It may have sold out or wandered off.
        </p>
      </main>
    );
  }

  return (
    <main className="pt-8 lg:pt-16">
      <section className="mx-auto w-full max-w-[1400px] px-6 lg:px-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery
            key={selectedVariant?.id ?? "base"}
            images={displayImages}
            productName={product.name}
          />

          <div className="space-y-10">
            <ProductInfo
              product={product}
              selectedVariantId={selectedVariant?.id ?? null}
              selectedOptions={selectedOptions}
              allOptionsSelected={allOptionsSelected}
              onOptionChange={handleOptionChange}
            />
            <DetailTabs product={product} />
          </div>
        </div>
      </section>

      <section className="w-full mt-16 lg:mt-24">
        <RelatedProducts productId={product.id} />
      </section>
    </main>
  );
}
