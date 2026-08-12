import { PLPHero, ProductGrid } from "@ce/soja-shared/category";
import { useEffect, useState } from "react";
import { useSearchProducts } from "@/lib/hooks";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";
import Providers from "../Providers";

const PAGE_SIZE = 12;

export default function SearchContent() {
  return (
    <Providers>
      <SearchContentInner />
    </Providers>
  );
}

function SearchContentInner() {
  // The page is static, so `?q=` is only readable on the client. Both the server
  // render and the first client render start empty so hydration matches; `ready`
  // then gates the empty-state copy so it can't flash before the URL is read.
  const [query, setQuery] = useState("");
  const [ready, setReady] = useState(false);
  const wishlist = useWishlist();

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get("q") ?? "");
    setReady(true);
  }, []);

  // Keyed by query and reset while deriving it: resetting in an effect instead
  // would leave one render pairing the new query with the old page.
  const [paging, setPaging] = useState({ query, page: 1 });
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
        isLoading={!ready || isLoading}
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
