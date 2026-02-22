import type { Category, Item, Pagination, Product } from "@commercengine/storefront-sdk";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "./storefront";

// --- List Products (simple listing, e.g. home carousel) ---

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category_id?: string[];
}

interface UseProductsResult {
  products: Product[];
  pagination: Pagination | undefined;
  isLoading: boolean;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const { page = 1, limit = 6, category_id } = options;

  const query = useQuery({
    queryKey: ["products", { page, limit, category_id }],
    queryFn: async () => {
      const { data, error } = await sdk.catalog.listProducts({ page, limit, category_id });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  return {
    products: query.data?.products ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
  };
}

// --- Search Products (category/shop pages with faceted filters) ---

interface UseSearchProductsOptions {
  query?: string;
  page?: number;
  limit?: number;
  facets?: string[];
  filters?: Record<string, unknown>;
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
  const { query: searchQuery = "", page = 1, limit = 20, facets = ["*"], filters } = options;

  const rqQuery = useQuery({
    queryKey: ["searchProducts", { searchQuery, page, limit, facets, filters }],
    queryFn: async () => {
      const body: Record<string, unknown> = {
        query: searchQuery,
        page,
        limit,
        facets,
      };
      if (filters) body.filters = filters;

      const { data, error } = await sdk.catalog.searchProducts(body as never);
      if (error) throw new Error(error.message);
      return data;
    },
  });

  return {
    skus: rqQuery.data?.skus ?? [],
    facetDistribution: (rqQuery.data?.facet_distribution as FacetDistribution) ?? {},
    facetStats: (rqQuery.data?.facet_stats as FacetStats) ?? {},
    pagination: rqQuery.data?.pagination,
    isLoading: rqQuery.isLoading,
  };
}

// --- Product Detail (by ID) ---

interface UseProductDetailResult {
  product: Product | undefined;
  isLoading: boolean;
}

export function useProductDetail(productId: string): UseProductDetailResult {
  const query = useQuery({
    queryKey: ["productDetail", productId],
    queryFn: async () => {
      const { data, error } = await sdk.catalog.getProductDetail({ product_id_or_slug: productId });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!productId,
  });

  return {
    product: query.data?.product,
    isLoading: query.isLoading,
  };
}

// --- Categories ---

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
}

export function useCategories(): UseCategoriesResult {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await sdk.catalog.listCategories();
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return {
    categories: query.data?.categories ?? [],
    isLoading: query.isLoading,
  };
}
