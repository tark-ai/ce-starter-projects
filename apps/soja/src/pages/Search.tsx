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
  const [page, setPage] = useState(1);
  const wishlist = useWishlist();

  const { skus, pagination, isLoading } = useSearchProducts({
    query,
    page,
    limit: PAGE_SIZE,
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
