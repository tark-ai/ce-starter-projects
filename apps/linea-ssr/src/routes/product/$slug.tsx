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
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo } from "react";
import ProductCarousel from "@/components/content/ProductCarousel";
import ProductDescription from "@/components/product/ProductDescription";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { storefront } from "@/lib/storefront";

const SITE_URL = "https://linea-static.demo.commercengine.io";
const SITE_NAME = "Linea";

export const Route = createFileRoute("/product/$slug")({
  validateSearch: (search: Record<string, unknown>) => search as Record<string, string>,
  loader: async ({ params }) => {
    const sdk = storefront.publicStorefront();
    const { data, error } = await sdk.catalog.getProductDetail({ product_id: params.slug });
    if (error) throw new Error(error.message);
    const product = data?.product;
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    if (!product) return {};
    const productUrl = `${SITE_URL}/product/${product.slug}`;
    const productImage = product.images?.[0]?.url_zoom ?? product.images?.[0]?.url_standard;
    const productDescription =
      product.short_description ?? `Shop ${product.name} from ${SITE_NAME}`;
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
              availability: product.stock_available
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
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
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

  const categoryName = product?.categories?.[0]?.name;
  const categorySlug = product?.categories?.[0]?.slug;

  return (
    <main className="pt-6">
      <section className="w-full px-6">
        {/* Breadcrumb - Show above image on smaller screens */}
        <div className="lg:hidden mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {categoryName && categorySlug && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/category/$category" params={{ category: categorySlug }}>
                        {categoryName}
                      </Link>
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
        <ProductCarousel productId={product.id} />
      </section>
    </main>
  );
}
