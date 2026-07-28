import {
  findVariantBySelection,
  getDefaultVariant,
  getVariantOptionSelection,
  hasAllOptionsSelected,
  optionQueryParamKey,
} from "@ce/little-things-shared/lib/variants";
import type { Product } from "@commercengine/storefront";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import DetailTabs from "@/components/product/DetailTabs";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { storefront } from "@/lib/storefront";

export const Route = createFileRoute("/product/$slug")({
  validateSearch: (search: Record<string, unknown>) => search as Record<string, string>,
  loader: async ({ params }): Promise<{ product: Product | null }> => {
    try {
      const sdk = storefront.publicStorefront();
      const { data } = await sdk.catalog.getProductDetail({ product_id: params.slug });
      return { product: data?.product ?? null };
    } catch {
      return { product: null };
    }
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) return { meta: [{ title: `Product Not Found | ${SITE_NAME}` }] };

    const productUrl = `${SITE_URL}/product/${product.slug}`;
    const productImage = product.images?.[0]?.url_zoom ?? product.images?.[0]?.url_standard;
    const productDescription =
      product.short_description ??
      `Shop ${product.name} from ${SITE_NAME}. The good stuff, minus the fluff.`;
    const fullTitle = `${product.name} | ${SITE_NAME}`;

    return {
      meta: [
        { title: fullTitle },
        { name: "description", content: productDescription },
        { property: "og:title", content: fullTitle },
        { property: "og:type", content: "product" },
        { property: "og:image", content: productImage },
        { property: "og:url", content: productUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: fullTitle },
        { name: "twitter:description", content: productDescription },
        { name: "twitter:image", content: productImage },
      ],
      links: [{ rel: "canonical", href: productUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: productDescription,
            image: productImage,
            sku: product.sku ?? product.slug,
            url: productUrl,
            brand: { "@type": "Brand", name: SITE_NAME },
            offers: {
              "@type": "Offer",
              url: productUrl,
              priceCurrency: product.pricing.currency,
              price: product.pricing.selling_price,
              availability:
                product.stock_available || product.backorder
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            ...(product.reviews_count > 0
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: (product.reviews_rating_sum / product.reviews_count).toFixed(1),
                    reviewCount: product.reviews_count,
                  },
                }
              : {}),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
              ...(product.categories?.[0]
                ? [
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: product.categories[0].name,
                      item: `${SITE_URL}/category/${product.categories[0].slug}`,
                    },
                  ]
                : []),
              {
                "@type": "ListItem",
                position: product.categories?.[0] ? 3 : 2,
                name: product.name,
                item: productUrl,
              },
            ],
          }),
        },
      ],
    };
  },
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
