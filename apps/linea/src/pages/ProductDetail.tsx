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
import { useCallback, useEffect, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCarousel from "../components/content/ProductCarousel";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import ProductDescription from "../components/product/ProductDescription";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import SEO, { SITE_NAME, SITE_URL } from "../components/Seo";
import { useProductDetail } from "../lib/hooks";

const ProductDetail = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { product, isLoading } = useProductDetail(slug || "");

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
      // Type assertion needed: app and shared package resolve different @commercengine/storefront-sdk versions
      return variantFromUrl ?? getDefaultVariant(product);
    }
    return findVariantBySelection(product.variants, optionKeys, selectedOptions);
  }, [product, optionKeys, selectedOptions, variantFromUrl]);

  useEffect(() => {
    if (!product?.has_variant) return;

    const nextParams = new URLSearchParams(searchParams);
    let changed = false;

    const hasAnyOptionParam = optionKeys.some((key) => nextParams.has(optionQueryParamKey(key)));

    if (optionKeys.length === 0) {
      const bootstrapVariant = variantFromUrl ?? getDefaultVariant(product);
      if (bootstrapVariant && nextParams.get("variant") !== bootstrapVariant.slug) {
        nextParams.set("variant", bootstrapVariant.slug);
        changed = true;
      }
      if (changed) {
        setSearchParams(nextParams, { replace: true });
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
      setSearchParams(nextParams, { replace: true });
    }
  }, [product, searchParams, setSearchParams, optionKeys, variantFromUrl, selectedVariant]);

  const handleOptionChange = useCallback(
    (optionKey: string, optionValue: string) => {
      if (!product?.has_variant) return;

      const nextParams = new URLSearchParams(searchParams);
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

      setSearchParams(nextParams, { replace: true });
    },
    [product, searchParams, setSearchParams, optionKeys]
  );

  const displayImages = selectedVariant?.images?.length
    ? selectedVariant.images
    : (product?.images ?? []);

  const categoryName = product?.categories?.[0]?.name;
  const categorySlug = product?.categories?.[0]?.slug;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
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
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-6 px-6 text-center py-24">
          <p className="text-sm font-light text-muted-foreground">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const pricing = selectedVariant?.pricing ?? product.pricing;
  const isPurchasable =
    (selectedVariant?.stock_available ?? product.stock_available) ||
    (selectedVariant?.backorder ?? product.backorder);
  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const productImage = displayImages[0]?.url_zoom ?? displayImages[0]?.url_standard;
  const productDescription = product.short_description ?? `Shop ${product.name} from ${SITE_NAME}`;

  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...(categoryName && categorySlug
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: `${SITE_URL}/category/${categorySlug}`,
            },
          ]
        : []),
      { "@type": "ListItem", position: categoryName ? 3 : 2, name: product.name },
    ],
  };

  const productSchema: Record<string, unknown> = {
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
      priceCurrency: pricing.currency,
      price: pricing.selling_price,
      availability: isPurchasable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
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
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={product.name}
        description={productDescription}
        canonical={productUrl}
        ogImage={productImage}
        ogType="product"
        jsonLd={[productSchema, breadcrumbSchema]}
      />
      <Header />

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
                {categoryName && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={`/category/${categorySlug}`}>{categoryName}</Link>
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

      <Footer />
    </div>
  );
};

export default ProductDetail;
