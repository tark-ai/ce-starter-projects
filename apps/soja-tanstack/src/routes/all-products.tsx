import type { Category, Item, Pagination } from "@commercengine/storefront";
import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/category/CategoryView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { PLP_COPY } from "@/lib/site-content";
import { storefront } from "@/lib/storefront";

export const Route = createFileRoute("/all-products")({
  loader: async () => {
    try {
      const sdk = storefront.publicStorefront();
      const [skuResult, categoryResult] = await Promise.all([
        sdk.catalog.searchProducts({ query: "", page: 1, limit: 12 }),
        sdk.catalog.listCategories(),
      ]);

      return {
        skus: skuResult.data?.skus ?? [],
        pagination: skuResult.data?.pagination,
        categories: categoryResult.data?.categories ?? [],
      };
    } catch {
      return {
        skus: [] as Item[],
        pagination: undefined as Pagination | undefined,
        categories: [] as Category[],
      };
    }
  },
  head: () => {
    const url = `${SITE_URL}/all-products`;
    return {
      meta: [
        { title: `${PLP_COPY.title} | ${SITE_NAME}` },
        { name: "description", content: PLP_COPY.subtitle },
        { property: "og:title", content: `${PLP_COPY.title} | ${SITE_NAME}` },
        { property: "og:description", content: PLP_COPY.subtitle },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: AllProductsPage,
});

function AllProductsPage() {
  const { skus, pagination, categories } = Route.useLoaderData();
  return <CategoryView categories={categories} initialSkus={skus} initialPagination={pagination} />;
}
