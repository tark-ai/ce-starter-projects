"use client";

import { Reveal } from "@ce/soja-shared/content";
import type { SojaProductDetail } from "@ce/soja-shared/lib/product-meta";
import {
  findVariantBySelection,
  getDefaultVariant,
  getVariantOptionSelection,
  hasAllOptionsSelected,
  optionQueryParamKey,
} from "@ce/soja-shared/lib/variants";
import {
  DetailAccordions,
  HowToUse,
  ProductImageGallery,
  ProductInfo,
  RelatedProducts,
} from "@ce/soja-shared/product";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useProductDetail, useSimilarProducts } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

interface ProductContentProps {
  serverProduct?: SojaProductDetail;
}

export function ProductContent({ serverProduct }: ProductContentProps) {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const wishlist = useWishlist();

  const clientDetail = useProductDetail(slug || "", { enabled: !serverProduct });
  const product = serverProduct ?? clientDetail.product;
  const isLoading = serverProduct ? false : clientDetail.isLoading;
  // The server only reaches here for non-404 failures, so a failed retry is an
  // outage rather than a missing product.
  const loadFailed = !serverProduct && !clientDetail.product && clientDetail.isError;

  const { items: related } = useSimilarProducts(product?.id ?? "");

  const variants = useMemo(() => product?.variants ?? [], [product]);
  const optionKeys = useMemo(
    () => product?.variant_options?.map((option) => option.key) ?? [],
    [product]
  );

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
    const variantSlug = searchParams.get("variant");
    if (!variantSlug) return null;
    return variants.find((variant) => variant.slug === variantSlug) ?? null;
  }, [variants, searchParams]);

  const selectedVariant = useMemo(() => {
    if (!product?.has_variant) return null;
    if (optionKeys.length === 0) return variantFromUrl ?? getDefaultVariant(product);
    return findVariantBySelection(variants, optionKeys, selectedOptions);
  }, [product, variants, optionKeys, selectedOptions, variantFromUrl]);

  useEffect(() => {
    if (!product?.has_variant) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    const replaceWith = (search: URLSearchParams) =>
      router.replace(`/product/${slug}?${search.toString()}`);

    if (optionKeys.length === 0) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant && nextParams.get("variant") !== bootstrapVariant.slug) {
        nextParams.set("variant", bootstrapVariant.slug);
        replaceWith(nextParams);
      }
      return;
    }

    let changed = false;
    const hasAnyOptionParam = optionKeys.some((key) => nextParams.has(optionQueryParamKey(key)));

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
      // A valid slug with only some options set: complete the selection from it
      // rather than discarding the variant the link pointed at.
      const selection = getVariantOptionSelection(variantFromUrl, optionKeys);
      let filled = false;
      for (const optionKey of optionKeys) {
        const queryKey = optionQueryParamKey(optionKey);
        if (nextParams.has(queryKey)) continue;
        const value = selection[optionKey];
        if (!value) continue;
        nextParams.set(queryKey, value);
        changed = true;
        filled = true;
      }
      if (!filled && nextParams.has("variant")) {
        nextParams.delete("variant");
        changed = true;
      }
    } else if (nextParams.has("variant")) {
      nextParams.delete("variant");
      changed = true;
    }

    if (changed) replaceWith(nextParams);
  }, [product, searchParams, router, slug, optionKeys, variantFromUrl, selectedVariant]);

  const handleOptionChange = useCallback(
    (optionKey: string, optionValue: string) => {
      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.set(optionQueryParamKey(optionKey), optionValue);

      const nextSelection: Record<string, string> = {};
      for (const key of optionKeys) {
        const value = nextParams.get(optionQueryParamKey(key));
        if (value) nextSelection[key] = value;
      }

      const matchedVariant = findVariantBySelection(variants, optionKeys, nextSelection);
      if (matchedVariant) {
        nextParams.set("variant", matchedVariant.slug);
      } else {
        nextParams.delete("variant");
      }

      router.replace(`/product/${slug}?${nextParams.toString()}`);
    },
    [variants, searchParams, router, slug, optionKeys]
  );

  const displayImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[var(--container-soja)] px-3 grid gap-12 py-16 tablet:grid-cols-2 tablet:gap-20">
        <div className="aspect-2/3 animate-pulse bg-accent" />
        <div className="flex flex-col gap-6 pt-8">
          <div className="h-10 w-3/4 animate-pulse bg-accent" />
          <div className="h-4 w-full animate-pulse bg-accent" />
          <div className="h-4 w-2/3 animate-pulse bg-accent" />
          <div className="mt-6 h-8 w-24 animate-pulse bg-accent" />
        </div>
      </main>
    );
  }

  if (loadFailed) {
    return (
      <main className="mx-auto w-full max-w-[var(--container-soja)] px-3 py-32">
        <h1 className="font-display text-[2rem] tracking-display">
          We couldn't load this formulation
        </h1>
        <p className="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
          The catalog didn't respond. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={() => clientDetail.refetch()}
          className="mt-10 h-12 bg-primary px-8 text-meta text-primary-foreground transition-colors duration-300 ease-soja hover:bg-primary-hover"
        >
          Try again
        </button>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto w-full max-w-[var(--container-soja)] px-3 py-32">
        <h1 className="font-display text-[2rem] tracking-display">Not found</h1>
        <p className="mt-6 max-w-[420px] text-meta leading-relaxed text-muted-foreground">
          This formulation is no longer available.
        </p>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto w-full max-w-[var(--container-soja)] px-3 grid gap-12 pt-12 pb-20 tablet:grid-cols-2 tablet:gap-20 tablet:pt-20">
        <div className="min-w-0 tablet:sticky tablet:top-28 tablet:self-start">
          <ProductImageGallery
            key={selectedVariant?.id ?? "base"}
            images={displayImages}
            productName={product.name}
          />
        </div>

        <div className="flex flex-col gap-14">
          <Reveal>
            <ProductInfo
              product={product}
              selectedVariantId={selectedVariant?.id ?? null}
              selectedOptions={selectedOptions}
              allOptionsSelected={allOptionsSelected}
              onOptionChange={handleOptionChange}
              wishlist={wishlist}
            />
          </Reveal>
          <Reveal delay={90}>
            <DetailAccordions product={product} />
          </Reveal>
        </div>
      </section>

      <HowToUse />

      <RelatedProducts items={related} LinkComponent={SojaLink} wishlist={wishlist} />
    </main>
  );
}
