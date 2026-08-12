import { CategoryFilterRow, PLPHero, ProductGrid, SortSelect } from "@ce/soja-shared/category";
import { BrandPillars } from "@ce/soja-shared/content";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { buildFilter } from "@/lib/build-filter";
import { useCategories, useSearchProducts } from "@/lib/hooks";
import { PLP_COPY, SHOP_CATEGORIES } from "@/lib/site-content";
import { SojaLink } from "@/lib/soja-routing";
import { useWishlist } from "@/lib/wishlist";

const PAGE_SIZE = 12;

const Category = () => {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { categories } = useCategories();
  const wishlist = useWishlist();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");

  const activeCategory = useMemo(
    () => categories.find((entry) => entry.slug === categorySlug),
    [categories, categorySlug]
  );

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
      route: entry.slug ? { path: `/category/${entry.slug}` } : { path: "/all-products" },
      active: entry.slug === (categorySlug ?? null),
    }));
  }, [categories, categorySlug]);

  const filter = useMemo(() => buildFilter({}, activeCategory?.name), [activeCategory?.name]);

  const { skus, pagination, isLoading } = useSearchProducts({
    page,
    limit: PAGE_SIZE,
    sort: sort ? [sort] : undefined,
    filter: filter.length > 0 ? filter : undefined,
    enabled: !categorySlug || Boolean(activeCategory),
  });

  const title = activeCategory?.name ?? PLP_COPY.title;
  const subtitle = activeCategory?.description || PLP_COPY.subtitle;

  return (
    <Layout>
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
        onPageChange={setPage}
        wishlist={wishlist}
        emptyMessage="Nothing in this collection yet."
      />
      <BrandPillars />
    </Layout>
  );
};

export default Category;
