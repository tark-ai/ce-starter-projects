import type {
  Category,
  Item,
  Pagination,
  Product,
  SearchProductsBody,
} from "@commercengine/storefront";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchListSkus,
  fetchProductDetail,
  fetchProducts,
  fetchSimilarProducts,
} from "./server-fns/catalog";
import { searchProducts } from "./server-fns/search";

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category_id?: string[];
  enabled?: boolean;
}

interface UseProductsResult {
  products: Product[];
  pagination: Pagination | undefined;
  isLoading: boolean;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { page = 1, limit = 6, category_id, enabled = true } = options;

  const query = useQuery({
    queryKey: ["products", { page, limit, category_id }],
    queryFn: () => fetchProducts({ data: { page, limit, category_id } }),
    enabled,
  });

  return {
    products: query.data?.products ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
  };
}

interface UseListSkusOptions {
  page?: number;
  limit?: number;
  category_id?: string[];
  enabled?: boolean;
}

interface UseListSkusResult {
  skus: Item[];
  pagination: Pagination | undefined;
  isLoading: boolean;
}

export function useListSkus(options: UseListSkusOptions = {}): UseListSkusResult {
  const { page = 1, limit = 20, category_id, enabled = true } = options;

  const rqQuery = useQuery({
    queryKey: ["listSkus", { page, limit, category_id }],
    queryFn: () => fetchListSkus({ data: { page, limit, category_id } }),
    enabled,
  });

  return {
    skus: rqQuery.data?.skus ?? [],
    pagination: rqQuery.data?.pagination,
    isLoading: rqQuery.isLoading,
  };
}

interface UseSearchProductsOptions {
  query?: string;
  page?: number;
  limit?: number;
  facets?: string[];
  filter?: SearchProductsBody["filter"];
  sort?: SearchProductsBody["sort"];
  enabled?: boolean;
}

interface FacetDistribution {
  [key: string]: { [value: string]: number };
}

interface FacetStats {
  [key: string]: { min: number; max: number };
}

interface UseSearchProductsResult {
  skus: Item[];
  facetDistribution: FacetDistribution;
  facetStats: FacetStats;
  pagination: Pagination | undefined;
  isLoading: boolean;
}

export function useSearchProducts(options: UseSearchProductsOptions = {}): UseSearchProductsResult {
  const {
    query: searchQuery = "",
    page = 1,
    limit = 20,
    facets = ["*"],
    filter,
    sort,
    enabled = true,
  } = options;

  const rqQuery = useQuery({
    queryKey: ["searchProducts", { searchQuery, page, limit, facets, filter, sort }],
    queryFn: () =>
      searchProducts({
        data: {
          query: searchQuery,
          page,
          limit,
          facets,
          filter,
          sort,
        },
      }),
    enabled,
  });

  return {
    skus: rqQuery.data?.skus ?? [],
    facetDistribution: (rqQuery.data?.facet_distribution as FacetDistribution) ?? {},
    facetStats: (rqQuery.data?.facet_stats as FacetStats) ?? {},
    pagination: rqQuery.data?.pagination,
    isLoading: rqQuery.isLoading,
  };
}

interface UseSimilarProductsResult {
  items: Item[];
  isLoading: boolean;
}

export function useSimilarProducts(productId: string): UseSimilarProductsResult {
  const query = useQuery({
    queryKey: ["similarProducts", productId],
    queryFn: () => fetchSimilarProducts({ data: productId }),
    enabled: !!productId,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
  };
}

interface UseProductDetailResult {
  product: Product | undefined;
  isLoading: boolean;
}

export function useProductDetail(slug: string): UseProductDetailResult {
  const query = useQuery({
    queryKey: ["productDetail", slug],
    queryFn: () => fetchProductDetail({ data: slug }),
    enabled: !!slug,
  });

  return {
    product: query.data ?? undefined,
    isLoading: query.isLoading,
  };
}

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
}

export function useCategories(options: { enabled?: boolean } = {}): UseCategoriesResult {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
  };
}
