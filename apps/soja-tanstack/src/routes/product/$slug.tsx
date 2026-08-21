import { Reveal } from "@ce/soja-shared/content";
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
import { serializeJsonLd } from "@commercengine/seo";
import { createTanStackStartProductHead } from "@commercengine/seo/tanstack-start";
import type { ProductDetail } from "@commercengine/storefront";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import { useSimilarProducts } from "@/lib/hooks";
import { seo } from "@/lib/seo";
import { SojaLink } from "@/lib/soja-routing";
import { storefront } from "@/lib/storefront";
import { useWishlist } from "@/lib/wishlist";

/**
 * `productHead` emits the product schema only, so the breadcrumb is the page's job. URLs come
 * from the route resolvers rather than string concatenation, so a custom `productBase` /
 * `categoryBase` stays correct here.
 */
async function productHeadWithBreadcrumb(product: ProductDetail) {
  const category = product.categories?.[0];
  const home = seo.config.site.url;
  const [head, productUrl, categoryUrl] = await Promise.all([
    createTanStackStartProductHead(seo, product),
    seo.productUrl(product),
    category ? seo.categoryUrl(category) : Promise.resolve(null),
  ]);

  const breadcrumb = seo.breadcrumbJsonLd([
    { name: "Home", url: home },
    ...(category && categoryUrl ? [{ name: category.name, url: categoryUrl }] : []),
    { name: product.name, url: productUrl ?? home },
  ]);

  return {
    ...head,
    scripts: [
      ...head.scripts,
      { type: "application/ld+json", children: serializeJsonLd(breadcrumb) },
    ],
  };
}

export const Route = createFileRoute("/product/$slug")({
  validateSearch: (search: Record<string, unknown>) => search as Record<string, string>,
  loader: async ({ params }) => {
    try {
      const sdk = storefront.publicStorefront();
      const { data, error, response } = await sdk.catalog.getProductDetail({
        product_id: params.slug,
      });

      // Only a 404 is a real absence; anything else is transient and must not be
      // presented as a permanently missing product.
      if (error && response.status !== 404) {
        throw new Error(error.message);
      }
      const product = data?.product ?? null;
      // `head` is synchronous, so head data is built here and returned through loaderData.
      return {
        product,
        seoHead: product ? await productHeadWithBreadcrumb(product) : undefined,
      };
    } catch (cause) {
      throw new Error("The catalog is unavailable right now.", { cause });
    }
  },
  head: ({ loaderData }) => loaderData?.seoHead ?? {},
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/product/$slug" });
  const wishlist = useWishlist();

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
      const value = search[optionQueryParamKey(optionKey)];
      if (value) selection[optionKey] = value;
    }
    return selection;
  }, [optionKeys, search]);

  const allOptionsSelected = useMemo(() => {
    if (!product?.has_variant) return false;
    if (optionKeys.length === 0) return true;
    return hasAllOptionsSelected(optionKeys, selectedOptions);
  }, [product, optionKeys, selectedOptions]);

  const variantFromUrl = useMemo(() => {
    if (!search.variant) return null;
    return variants.find((variant) => variant.slug === search.variant) ?? null;
  }, [variants, search.variant]);

  const selectedVariant = useMemo(() => {
    if (!product?.has_variant) return null;
    if (optionKeys.length === 0) return variantFromUrl ?? getDefaultVariant(product);
    return findVariantBySelection(variants, optionKeys, selectedOptions);
  }, [product, variants, optionKeys, selectedOptions, variantFromUrl]);

  const replaceSearch = useCallback(
    (next: Record<string, string>) => {
      void navigate({ to: "/product/$slug", params: { slug }, search: next, replace: true });
    },
    [navigate, slug]
  );

  // The URL is the single source of truth, so a shared link reopens the same variant.
  useEffect(() => {
    if (!product?.has_variant) return;

    const next: Record<string, string> = { ...search };

    if (optionKeys.length === 0) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant && next.variant !== bootstrapVariant.slug) {
        next.variant = bootstrapVariant.slug;
        replaceSearch(next);
      }
      return;
    }

    let changed = false;
    const hasAnyOptionParam = optionKeys.some(
      (key) => next[optionQueryParamKey(key)] !== undefined
    );

    if (!hasAnyOptionParam) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant) {
        const defaultSelection = getVariantOptionSelection(bootstrapVariant, optionKeys);
        for (const optionKey of optionKeys) {
          const value = defaultSelection[optionKey];
          if (!value) continue;
          const queryKey = optionQueryParamKey(optionKey);
          if (next[queryKey] !== value) {
            next[queryKey] = value;
            changed = true;
          }
        }
        if (next.variant !== bootstrapVariant.slug) {
          next.variant = bootstrapVariant.slug;
          changed = true;
        }
      }
    } else if (selectedVariant) {
      if (next.variant !== selectedVariant.slug) {
        next.variant = selectedVariant.slug;
        changed = true;
      }
    } else if (variantFromUrl) {
      // A valid slug with only some options set: complete the selection from it
      // rather than discarding the variant the link pointed at.
      const selection = getVariantOptionSelection(variantFromUrl, optionKeys);
      let filled = false;
      for (const optionKey of optionKeys) {
        const queryKey = optionQueryParamKey(optionKey);
        if (next[queryKey] !== undefined) continue;
        const value = selection[optionKey];
        if (!value) continue;
        next[queryKey] = value;
        changed = true;
        filled = true;
      }
      if (!filled && next.variant !== undefined) {
        delete next.variant;
        changed = true;
      }
    } else if (next.variant !== undefined) {
      delete next.variant;
      changed = true;
    }

    if (changed) replaceSearch(next);
  }, [product, search, optionKeys, variantFromUrl, selectedVariant, replaceSearch]);

  const handleOptionChange = useCallback(
    (optionKey: string, optionValue: string) => {
      const next: Record<string, string> = { ...search };
      next[optionQueryParamKey(optionKey)] = optionValue;

      const nextSelection: Record<string, string> = {};
      for (const key of optionKeys) {
        const value = next[optionQueryParamKey(key)];
        if (value) nextSelection[key] = value;
      }

      const matchedVariant = findVariantBySelection(variants, optionKeys, nextSelection);
      if (matchedVariant) {
        next.variant = matchedVariant.slug;
      } else {
        delete next.variant;
      }

      replaceSearch(next);
    },
    [variants, search, optionKeys, replaceSearch]
  );

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
