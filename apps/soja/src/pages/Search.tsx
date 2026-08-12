import { PLPHero, ProductGrid } from "@ce/soja-shared/category";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useSearchProducts } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

const PAGE_SIZE = 12;

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const wishlist = useWishlist();

  // The route component stays mounted across searches, so the page is keyed by
  // query and reset while deriving it. Resetting in an effect instead would leave
  // one render pairing the new query with the old page, firing a wasted request.
  const [paging, setPaging] = useState({ query, page: 1 });
  const page = paging.query === query ? paging.page : 1;
  const setPage = (next: number) => setPaging({ query, page: next });

  const { skus, pagination, isLoading } = useSearchProducts({
    query,
    page,
    limit: PAGE_SIZE,
    enabled: !!query,
  });

  return (
    <Layout>
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
        onPageChange={setPage}
        wishlist={wishlist}
        emptyMessage={
          query ? `Nothing matched “${query}”.` : "Start typing to search the collection."
        }
      />
    </Layout>
  );
};

export default Search;
