import { useCallback, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProductCarousel from "../components/content/ProductCarousel";
import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import ProductDescription from "../components/product/ProductDescription";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import { useProductDetail } from "../lib/hooks";

const ProductDetail = () => {
  const { productId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { product, isLoading } = useProductDetail(productId || "");

  const selectedVariantId = useMemo(() => {
    if (!product?.has_variant) return null;
    const fromUrl = searchParams.get("variant");
    if (fromUrl && product.variants.some((v) => v.id === fromUrl)) return fromUrl;
    const defaultVariant = product.variants.find((v) => v.is_default);
    return defaultVariant?.id || product.variants[0]?.id || null;
  }, [product, searchParams]);

  const selectedVariant = product?.has_variant
    ? product.variants.find((v) => v.id === selectedVariantId)
    : null;

  const handleVariantChange = useCallback(
    (variantId: string) => {
      setSearchParams({ variant: variantId }, { replace: true });
    },
    [setSearchParams]
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

  return (
    <div className="min-h-screen bg-background">
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
                selectedVariantId={selectedVariantId}
                onVariantChange={handleVariantChange}
              />
              <ProductDescription product={product} />
            </div>
          </div>
        </section>

        <section className="w-full mt-16 lg:mt-24">
          <div className="mb-4 px-6">
            <h2 className="text-sm font-light text-foreground">You might also like</h2>
          </div>
          <ProductCarousel />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
