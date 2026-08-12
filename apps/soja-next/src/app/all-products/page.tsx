/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Category, Item, Pagination } from "@commercengine/storefront";
import type { Metadata } from "next";
import { OG_IMAGES, SITE_NAME, SITE_URL } from "@/lib/constants";
import { PLP_COPY } from "@/lib/site-content";
import { storefront } from "@/lib/storefront";
import { CategoryContent } from "../category-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: PLP_COPY.title,
  description: `Browse every formulation from ${SITE_NAME} in one place. ${PLP_COPY.subtitle}`,
  openGraph: {
    title: `${PLP_COPY.title} | ${SITE_NAME}`,
    description: PLP_COPY.subtitle,
    type: "website",
    url: `${SITE_URL}/all-products`,
    images: OG_IMAGES,
  },
};

export default async function AllProductsPage() {
  let skus: Item[] = [];
  let pagination: Pagination | undefined;
  let categories: Category[] = [];

  try {
    const sdk = storefront.publicStorefront();

    const [skuResult, categoryResult] = await Promise.all([
      sdk.catalog.searchProducts({ query: "", page: 1, limit: 12 }),
      sdk.catalog.listCategories(),
    ]);

    skus = skuResult.data?.skus ?? [];
    pagination = skuResult.data?.pagination;
    categories = categoryResult.data?.categories ?? [];
  } catch {
    skus = [];
  }

  return (
    <CategoryContent categories={categories} initialSkus={skus} initialPagination={pagination} />
  );
}
