import {
  findVariantBySelection,
  getDefaultVariant,
  getVariantOptionSelection,
  hasAllOptionsSelected,
  optionQueryParamKey,
} from "@ce/little-things-shared/lib/variants";
import { serializeJsonLd } from "@commercengine/seo";
import { createTanStackStartProductHead } from "@commercengine/seo/tanstack-start";
import type { ProductDetail } from "@commercengine/storefront";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import DetailTabs from "@/components/product/DetailTabs";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { seo } from "@/lib/seo";
import { storefront } from "@/lib/storefront";

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
      const { data } = await sdk.catalog.getProductDetail({ product_id: params.slug });
      const product = data?.product ?? null;
      // `head` is synchronous, so head data is built here and returned through loaderData.
      return {
        product,
        seoHead: product ? await productHeadWithBreadcrumb(product) : undefined,
      };
    } catch {
      return { product: null, seoHead: undefined };
    }
  },
  head: ({ loaderData }) => loaderData?.seoHead ?? {},
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const { slug } = Route.useParams();
  const search = Route.useSearch() as Record<string, string>;
  const navigate = useNavigate({ from: "/product/$slug" });

  const optionKeys = useMemo(() => {
    if (!product?.has_variant || !product.variant_options) return [];
    return product.variant_options.map((option) => option.key);
  }, [product]);

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
    if (!product?.has_variant) return null;
    const variantSlug = search.variant;
    if (!variantSlug) return null;
    return product.variants.find((variant) => variant.slug === variantSlug) ?? null;
  }, [product, search]);

  const selectedVariant = useMemo(() => {
    if (!product?.has_variant) return null;
    if (optionKeys.length === 0) {
      return variantFromUrl ?? getDefaultVariant(product);
    }
    return findVariantBySelection(product.variants, optionKeys, selectedOptions);
  }, [product, optionKeys, selectedOptions, variantFromUrl]);

  useEffect(() => {
    if (!product?.has_variant) return;

    const nextSearch: Record<string, string> = { ...search };
    let changed = false;

    const hasAnyOptionParam = optionKeys.some(
      (key) => nextSearch[optionQueryParamKey(key)] !== undefined
    );

    if (optionKeys.length === 0) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant && nextSearch.variant !== bootstrapVariant.slug) {
        nextSearch.variant = bootstrapVariant.slug;
        changed = true;
      }
      if (changed) {
        navigate({
          to: "/product/$slug",
          params: { slug },
          search: () => nextSearch,
          replace: true,
        });
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
          if (nextSearch[queryKey] !== value) {
            nextSearch[queryKey] = value;
            changed = true;
          }
        }
        if (nextSearch.variant !== bootstrapVariant.slug) {
          nextSearch.variant = bootstrapVariant.slug;
          changed = true;
        }
      }
    } else if (selectedVariant) {
      if (nextSearch.variant !== selectedVariant.slug) {
        nextSearch.variant = selectedVariant.slug;
        changed = true;
      }
    } else if (variantFromUrl) {
      const variantSelection = getVariantOptionSelection(variantFromUrl, optionKeys);
      let filledMissingOption = false;

      for (const optionKey of optionKeys) {
        const queryKey = optionQueryParamKey(optionKey);
        if (nextSearch[queryKey] !== undefined) continue;

        const value = variantSelection[optionKey];
        if (!value) continue;

        nextSearch[queryKey] = value;
        changed = true;
        filledMissingOption = true;
      }

      if (!filledMissingOption && nextSearch.variant !== undefined) {
        delete nextSearch.variant;
        changed = true;
      }
    } else if (nextSearch.variant !== undefined) {
      delete nextSearch.variant;
      changed = true;
    }

    if (changed) {
      navigate({
        to: "/product/$slug",
        params: { slug },
        search: nextSearch,
        replace: true,
      });
    }
  }, [product, search, navigate, slug, optionKeys, variantFromUrl, selectedVariant]);

  const handleOptionChange = useCallback(
    (optionKey: string, optionValue: string) => {
      if (!product?.has_variant) return;

      const nextSearch: Record<string, string> = { ...search };
      nextSearch[optionQueryParamKey(optionKey)] = optionValue;

      const nextSelection: Record<string, string> = {};
      for (const key of optionKeys) {
        const value = nextSearch[optionQueryParamKey(key)];
        if (value) nextSelection[key] = value;
      }

      const matchedVariant = findVariantBySelection(product.variants, optionKeys, nextSelection);
      if (matchedVariant) {
        nextSearch.variant = matchedVariant.slug;
      } else {
        delete nextSearch.variant;
      }

      navigate({
        to: "/product/$slug",
        params: { slug },
        search: nextSearch,
        replace: true,
      });
    },
    [product, search, navigate, slug, optionKeys]
  );

  const displayImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);

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
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery
              key={selectedVariant?.id ?? "base"}
              images={displayImages}
              productName={product.name}
            />
          </div>

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
