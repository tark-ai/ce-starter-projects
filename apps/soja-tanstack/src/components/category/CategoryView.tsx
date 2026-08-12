import { CategoryFilterRow, PLPHero, ProductGrid, SortSelect } from "@ce/soja-shared/category";
import { BrandPillars } from "@ce/soja-shared/content";
import type { SojaRoute } from "@ce/soja-shared/lib/routing";
import type { Category, Item, Pagination } from "@commercengine/storefront";
import { useMemo, useState } from "react";
import { buildFilter } from "@/lib/build-filter";
import { useCategories, useSearchProducts } from "@/lib/hooks";
import { PLP_COPY, SHOP_CATEGORIES } from "@/lib/site-content";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

const PAGE_SIZE = 12;

interface CategoryViewProps {
  categorySlug?: string;
  categoryName?: string;
  categoryDescription?: string;
  categories?: Category[];
  initialSkus: Item[];
  initialPagination: Pagination | undefined;
}

export function CategoryView({
  categorySlug,
  categoryName: loaderCategoryName,
  categoryDescription,
  categories: loaderCategories,
  initialSkus,
  initialPagination,
}: CategoryViewProps) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const wishlist = useWishlist();

  const clientCategories = useCategories({ enabled: !loaderCategories?.length });
  const categories = loaderCategories?.length ? loaderCategories : clientCategories.categories;

  const categoryName =
    loaderCategoryName ?? categories.find((entry) => entry.slug === categorySlug)?.name;

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

  const usingInitialData = page === 1 && sort === "";

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

  const slugDisplayName = categorySlug
    ? (() => {
        const decoded = decodeURIComponent(categorySlug).replace(/-/g, " ");
        return decoded.charAt(0).toUpperCase() + decoded.slice(1);
      })()
    : undefined;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main>
      <PLPHero
        title={categoryName ?? slugDisplayName ?? PLP_COPY.title}
        subtitle={categoryDescription || PLP_COPY.subtitle}
      />
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
