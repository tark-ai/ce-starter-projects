"use client";

import { PLPHero, ProductGrid } from "@ce/soja-shared/category";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSearchProducts } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

const PAGE_SIZE = 12;

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const wishlist = useWishlist();

  // Keyed by query and reset while rendering: an effect would leave one render pairing
  // the new query with the old page, firing a request for a page that may not exist.
  // Storing the reset instead of only deriving it is what stops a later return to an
  // earlier query from restoring the page it was left on.
  const [paging, setPaging] = useState({ query, page: 1 });
  if (paging.query !== query) setPaging({ query, page: 1 });
  const page = paging.query === query ? paging.page : 1;
  const setPage = (next: number) => setPaging({ query, page: next });

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
