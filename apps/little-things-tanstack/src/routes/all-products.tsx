import type { Item, Pagination } from "@commercengine/storefront";
import { createFileRoute } from "@tanstack/react-router";
import { CategoryView } from "@/components/category/CategoryView";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { storefront } from "@/lib/storefront";

export const Route = createFileRoute("/all-products")({
  loader: async () => {
    try {
      const sdk = storefront.publicStorefront();
      const { data } = await sdk.catalog.listSkus({ page: 1, limit: 20 });
      return {
        skus: (data?.skus ?? []) as Item[],
        pagination: data?.pagination as Pagination | undefined,
      };
    } catch {
      return { skus: [] as Item[], pagination: undefined as Pagination | undefined };
    }
  },
  head: () => {
    const description = `Browse every product from ${SITE_NAME} in one place — a tight, opinionated catalog where everything earns its spot.`;
    return {
      meta: [
        { title: `All products | ${SITE_NAME}` },
        { name: "description", content: description },
        { property: "og:title", content: `All products | ${SITE_NAME}` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${SITE_URL}/all-products` },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/all-products` }],
    };
  },
  component: AllProductsPage,
});

function AllProductsPage() {
  const { skus, pagination } = Route.useLoaderData();
  return <CategoryView initialSkus={skus} initialPagination={pagination} />;
}
