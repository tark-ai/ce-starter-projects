import {
  findVariantBySelection,
  getDefaultVariant,
  getVariantOptionSelection,
  hasAllOptionsSelected,
  optionQueryParamKey,
} from "@ce/linea-shared/lib/variants";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ce/ui/components/ui/breadcrumb";
import type { Item, Product } from "@commercengine/storefront";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useProductDetail } from "@/lib/hooks";
import ProductCarousel from "../content/ProductCarousel";
import Providers from "../Providers";
import ProductDescription from "./ProductDescription";
import ProductImageGallery from "./ProductImageGallery";
import ProductInfo from "./ProductInfo";

interface ProductContentProps {
  serverProduct?: Product;
  serverSimilarItems?: Item[];
}

function getSearchParams(): URLSearchParams {
  if (typeof window === "undefined") return new URLSearchParams();
  return new URLSearchParams(window.location.search);
}

function getSlugFromPath(): string {
  if (typeof window === "undefined") return "";
  const parts = window.location.pathname.split("/");
  return parts[parts.length - 1] || "";
}

export default function ProductContent(props: ProductContentProps) {
  return (
    <Providers>
      <ProductContentInner {...props} />
    </Providers>
  );
}

function ProductContentInner({ serverProduct, serverSimilarItems }: ProductContentProps) {
  const [searchParams, setSearchParams] = useState(getSearchParams);
  const slug = useMemo(getSlugFromPath, []);
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

  const replaceUrl = useCallback((nextParams: URLSearchParams) => {
    const newUrl = `${window.location.pathname}?${nextParams.toString()}`;
    window.history.replaceState(null, "", newUrl);
    setSearchParams(new URLSearchParams(nextParams));
  }, []);

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
      if (changed) replaceUrl(nextParams);
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

    if (changed) replaceUrl(nextParams);
  }, [product, searchParams, optionKeys, variantFromUrl, selectedVariant, replaceUrl]);

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

      replaceUrl(nextParams);
    },
    [product, searchParams, optionKeys, replaceUrl]
  );

  const displayImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);

  const categoryName = product?.categories?.[0]?.name;
  const categorySlug = product?.categories?.[0]?.slug;

  if (isLoading) {
    return (
      <main className="pt-6 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="aspect-square bg-muted/20 animate-pulse" />
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
      <main className="pt-6 px-6 text-center py-24">
        <p className="text-sm font-light text-muted-foreground">Product not found.</p>
      </main>
    );
  }

  return (
    <main className="pt-6">
      <section className="w-full px-6">
        <div className="lg:hidden mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href="/">Home</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {categoryName && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <a href={`/category/${categorySlug}`}>{categoryName}</a>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <ProductImageGallery images={displayImages} productName={product.name} />

          <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
            <ProductInfo
              product={product}
              selectedVariantId={selectedVariant?.id ?? null}
              selectedOptions={selectedOptions}
              allOptionsSelected={allOptionsSelected}
              onOptionChange={handleOptionChange}
            />
            <ProductDescription product={product} />
          </div>
        </div>
      </section>

      <section className="w-full mt-16 lg:mt-24">
        <div className="mb-4 px-6">
          <h2 className="text-sm font-light text-foreground">You might also like</h2>
        </div>
        <ProductCarousel productId={product.id} serverProducts={serverSimilarItems} />
      </section>
    </main>
  );
}
