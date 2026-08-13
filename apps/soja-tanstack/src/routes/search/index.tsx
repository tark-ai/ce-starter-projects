import { PLPHero, ProductGrid } from "@ce/soja-shared/category";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { useSearchProducts } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

const PAGE_SIZE = 12;

export const Route = createFileRoute("/search/")({
  validateSearch: (search: Record<string, unknown>) => ({ q: (search.q as string) ?? "" }),
  head: () => ({
    meta: [
      { title: `Search | ${SITE_NAME}` },
      {
        name: "description",
        content: `Search the full ${SITE_NAME} catalog by name, ingredient or ritual.`,
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/search` }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q: query } = Route.useSearch();
  const [page, setPage] = useState(1);
  const wishlist = useWishlist();

  // A new query starts a new result set, so drop the page the user had reached.
  const previousQuery = useRef(query);
  useEffect(() => {
    if (previousQuery.current !== query) {
      previousQuery.current = query;
      setPage(1);
    }
  }, [query]);

  const { skus, pagination, isLoading } = useSearchProducts({
    query,
    page,
    limit: PAGE_SIZE,
    enabled: !!query,
  });

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <PLPHero
        title="Search"
        query={query || undefined}
        subtitle={query ? undefined : "Search our formulations by name, ingredient or ritual."}
      />
      <ProductGrid
        skus={skus}
        isLoading={isLoading}
        LinkComponent={SojaLink}
        pagination={pagination}
        onPageChange={handlePageChange}
        wishlist={wishlist}
        emptyMessage={
          query ? `Nothing matched “${query}”.` : "Start typing to search the collection."
        }
      />
    </main>
  );
}
