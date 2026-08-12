import { PLPHero, ProductGrid } from "@ce/soja-shared/category";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useSearchProducts } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

const PAGE_SIZE = 12;

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [page, setPage] = useState(1);
  const wishlist = useWishlist();

  // The route component stays mounted across searches, so a new query would
  // otherwise open on the previous query's page.
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
