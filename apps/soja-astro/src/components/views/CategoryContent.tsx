import { CategoryFilterRow, PLPHero, ProductGrid, SortSelect } from "@ce/soja-shared/category";
import { BrandPillars } from "@ce/soja-shared/content";
import { categoryTitleFromSlug, matchCategory } from "@ce/soja-shared/lib/category-slug";
import type { SojaRoute } from "@ce/soja-shared/lib/routing";
import type { Category, Item, Pagination } from "@commercengine/storefront";
import { useMemo, useState } from "react";
import { buildFilter } from "@/lib/build-filter";
import { useCategories, useSearchProducts } from "@/lib/hooks";
import { PLP_COPY, SHOP_CATEGORIES } from "@/lib/site-content";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";
import Providers from "../Providers";

const PAGE_SIZE = 12;

interface CategoryContentProps {
  categorySlug?: string;
  categoryName?: string;
  categoryDescription?: string;
  categories?: Category[];
  initialSkus: Item[];
  initialPagination: Pagination | undefined;
}

export default function CategoryContent(props: CategoryContentProps) {
  return (
    <Providers>
      <CategoryContentInner {...props} />
    </Providers>
  );
}

function CategoryContentInner({
  categorySlug,
  categoryName: serverCategoryName,
  categoryDescription,
  categories: serverCategories,
  initialSkus,
  initialPagination,
}: CategoryContentProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const wishlist = useWishlist();

  const needsClientCategories = !serverCategories?.length;
  const clientCategories = useCategories({ enabled: needsClientCategories });
  const categories = serverCategories?.length ? serverCategories : clientCategories.categories;

  const categoryName = serverCategoryName ?? matchCategory(categories, categorySlug)?.name;

  const categoryPending = Boolean(categorySlug) && !categoryName;

  const filterItems = useMemo(() => {
    const referenceSlugs = new Set<string>(SHOP_CATEGORIES.map((entry) => entry.slug));
    const extras = categories
      .filter((entry) => entry.slug && !referenceSlugs.has(entry.slug))
      .map((entry) => ({ label: entry.name, slug: entry.slug as string }));

    return [
      { label: "All products", slug: null },
      ...SHOP_CATEGORIES.map((entry) => ({ label: entry.label, slug: entry.slug })),
      ...extras,
    ].map((entry) => ({
      label: entry.label,
      route: (entry.slug
        ? { path: `/category/${entry.slug}` }
        : { path: "/all-products" }) as SojaRoute,
      active: entry.slug === (categorySlug ?? null),
    }));
  }, [categories, categorySlug]);

  const filter = useMemo(() => buildFilter({}, categoryName), [categoryName]);

  // An empty initial set is indistinguishable from a failed build-time read, so
  // treat it as missing and let the client query recover.
  const usingInitialData = initialSkus.length > 0 && page === 1 && sort === "";

  const searchResult = useSearchProducts({
    page,
    limit: PAGE_SIZE,
    sort: sort ? [sort] : undefined,
    filter: filter.length > 0 ? filter : undefined,
    enabled: !usingInitialData && !categoryPending,
  });

  const skus = usingInitialData ? initialSkus : searchResult.skus;
  const pagination = usingInitialData ? initialPagination : searchResult.pagination;
  const isLoading = usingInitialData ? false : searchResult.isLoading;

  const slugDisplayName = categorySlug ? categoryTitleFromSlug(categorySlug) : undefined;

  const title = categoryName ?? slugDisplayName ?? PLP_COPY.title;
  const subtitle = categoryDescription || PLP_COPY.subtitle;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <PLPHero title={title} subtitle={subtitle} />
      <CategoryFilterRow items={filterItems} LinkComponent={SojaLink} />
      <SortSelect
        value={sort}
        onChange={(next) => {
          setSort(next);
          setPage(1);
        }}
        count={pagination?.total_records}
      />
      <ProductGrid
        skus={skus}
        isLoading={isLoading}
        LinkComponent={SojaLink}
        pagination={pagination}
        onPageChange={handlePageChange}
        wishlist={wishlist}
        emptyMessage="Nothing in this collection yet."
      />
      <BrandPillars />
    </main>
  );
}
