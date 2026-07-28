/** biome-ignore-all lint/style/useComponentExportOnlyModules: Next.js page conventions */
import type { Item, Pagination } from "@commercengine/storefront";
import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { storefront } from "@/lib/storefront";
import { CategoryContent } from "../category-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All products",
  description: `Browse every product from ${SITE_NAME} in one place — a tight, opinionated catalog where everything earns its spot.`,
  openGraph: {
    title: `All products | ${SITE_NAME}`,
    description: `Browse every product from ${SITE_NAME} in one place.`,
    type: "website",
    url: `${SITE_URL}/all-products`,
  },
};

export default async function AllProductsPage() {
  let skus: Item[] = [];
  let pagination: Pagination | undefined;

  try {
    const sdk = storefront.publicStorefront();
    const { data } = await sdk.catalog.listSkus({ page: 1, limit: 20 });
    skus = data?.skus ?? [];
    pagination = data?.pagination;
  } catch {
    skus = [];
  }

  return <CategoryContent initialSkus={skus} initialPagination={pagination} />;
}
