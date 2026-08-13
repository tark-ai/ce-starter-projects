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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useProductDetail, useSimilarProducts } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";
import Providers from "../Providers";

interface ProductContentProps {
  slug: string;
  /** Absent only if the build-time read failed; the client query then retries. */
  serverProduct?: SojaProductDetail;
}

export default function ProductContent(props: ProductContentProps) {
  return (
    <Providers>
      <ProductContentInner {...props} />
    </Providers>
  );
}

/**
 * The page is static, so the query string is client-only. Start empty so the
 * server render and first client render agree, then read and write it through
 * history without a full navigation.
 */
function useUrlSearchParams(slug: string) {
  const [params, setParams] = useState(() => new URLSearchParams());

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  const replace = useCallback(
    (next: URLSearchParams) => {
      const query = next.toString();
      window.history.replaceState({}, "", `/product/${slug}${query ? `?${query}` : ""}`);
      setParams(new URLSearchParams(query));
    },
    [slug]
  );

  return { params, replace };
}

function ProductContentInner({ slug, serverProduct }: ProductContentProps) {
  const { params, replace } = useUrlSearchParams(slug);
  const wishlist = useWishlist();

  const clientDetail = useProductDetail(slug, { enabled: !serverProduct });
  const product = serverProduct ?? clientDetail.product;
  const isLoading = serverProduct ? false : clientDetail.isLoading;
  // A page only exists for a product the build saw, so a missing server product
  // means the build-time read failed rather than the product being gone.
  const loadFailed = !serverProduct && !clientDetail.product && clientDetail.isError;

  const { items: related } = useSimilarProducts(product?.id ?? "");

  // A store may have no variants configured at all.
  const variants = useMemo(() => product?.variants ?? [], [product]);
  const optionKeys = useMemo(
    () => product?.variant_options?.map((option) => option.key) ?? [],
    [product]
  );

  const selectedOptions = useMemo(() => {
    const selection: Record<string, string> = {};
    for (const optionKey of optionKeys) {
      const value = params.get(optionQueryParamKey(optionKey));
      if (value) selection[optionKey] = value;
    }
    return selection;
  }, [optionKeys, params]);

  const allOptionsSelected = useMemo(() => {
    if (!product?.has_variant) return false;
    if (optionKeys.length === 0) return true;
    return hasAllOptionsSelected(optionKeys, selectedOptions);
  }, [product, optionKeys, selectedOptions]);

  const variantFromUrl = useMemo(() => {
    const variantSlug = params.get("variant");
    if (!variantSlug) return null;
    return variants.find((variant) => variant.slug === variantSlug) ?? null;
  }, [variants, params]);

  const selectedVariant = useMemo(() => {
    if (!product?.has_variant) return null;
    if (optionKeys.length === 0) return variantFromUrl ?? getDefaultVariant(product);
    return findVariantBySelection(variants, optionKeys, selectedOptions);
  }, [product, variants, optionKeys, selectedOptions, variantFromUrl]);

  // The URL is the single source of truth, so a shared link reopens the same variant.
  useEffect(() => {
    if (!product?.has_variant) return;

    const next = new URLSearchParams(params);

    if (optionKeys.length === 0) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant && next.get("variant") !== bootstrapVariant.slug) {
        next.set("variant", bootstrapVariant.slug);
        replace(next);
      }
      return;
    }

    let changed = false;
    const hasAnyOptionParam = optionKeys.some((key) => next.has(optionQueryParamKey(key)));

    if (!hasAnyOptionParam) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant) {
        const defaultSelection = getVariantOptionSelection(bootstrapVariant, optionKeys);
        for (const optionKey of optionKeys) {
          const value = defaultSelection[optionKey];
          if (!value) continue;
          const queryKey = optionQueryParamKey(optionKey);
          if (next.get(queryKey) !== value) {
            next.set(queryKey, value);
            changed = true;
          }
        }
        if (next.get("variant") !== bootstrapVariant.slug) {
          next.set("variant", bootstrapVariant.slug);
          changed = true;
        }
      }
    } else if (selectedVariant) {
      if (next.get("variant") !== selectedVariant.slug) {
        next.set("variant", selectedVariant.slug);
        changed = true;
      }
    } else if (variantFromUrl) {
      // A valid slug with only some options set: complete the selection from it
      // rather than discarding the variant the link pointed at.
      const selection = getVariantOptionSelection(variantFromUrl, optionKeys);
      let filled = false;
      for (const optionKey of optionKeys) {
        const queryKey = optionQueryParamKey(optionKey);
        if (next.has(queryKey)) continue;
        const value = selection[optionKey];
        if (!value) continue;
        next.set(queryKey, value);
        changed = true;
        filled = true;
      }
      if (!filled && next.has("variant")) {
        next.delete("variant");
        changed = true;
      }
    } else if (next.has("variant")) {
      next.delete("variant");
      changed = true;
    }

    if (changed) replace(next);
  }, [product, params, optionKeys, variantFromUrl, selectedVariant, replace]);

  const handleOptionChange = useCallback(
    (optionKey: string, optionValue: string) => {
      const next = new URLSearchParams(params);
      next.set(optionQueryParamKey(optionKey), optionValue);

      const nextSelection: Record<string, string> = {};
      for (const key of optionKeys) {
        const value = next.get(optionQueryParamKey(key));
        if (value) nextSelection[key] = value;
      }

      const matchedVariant = findVariantBySelection(variants, optionKeys, nextSelection);
      if (matchedVariant) {
        next.set("variant", matchedVariant.slug);
      } else {
        next.delete("variant");
      }

      replace(next);
    },
    [variants, params, optionKeys, replace]
  );

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-[var(--container-soja)] px-3 grid gap-12 py-16 tablet:grid-cols-2 tablet:gap-20">
        <div className="aspect-2/3 animate-pulse bg-accent" />
        <div className="flex flex-col gap-6 pt-8">
          <div className="h-10 w-3/4 animate-pulse bg-accent" />
          <div className="h-4 w-full animate-pulse bg-accent" />
          <div className="h-4 w-2/3 animate-pulse bg-accent" />
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

  const displayImages = selectedVariant?.images?.length ? selectedVariant.images : product.images;

  return (
    <main>
      <section className="mx-auto w-full max-w-[var(--container-soja)] px-3 grid gap-12 pt-12 pb-20 tablet:grid-cols-2 tablet:gap-20 tablet:pt-20">
        {/* min-w-0 lets the thumbnail strip scroll rather than widening this cell. */}
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
