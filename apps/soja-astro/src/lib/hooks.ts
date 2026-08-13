import type { SojaProductDetail } from "@ce/soja-shared/lib/product-meta";
import type { Category, Item, Pagination, SearchProductsBody } from "@commercengine/storefront";
import { useQuery } from "@tanstack/react-query";
import { getSdk } from "./storefront-client";

// --- Search Products (query, category filter, sort) ---

interface UseSearchProductsOptions {
  query?: string;
  page?: number;
  limit?: number;
  filter?: SearchProductsBody["filter"];
  sort?: SearchProductsBody["sort"];
  enabled?: boolean;
}

interface UseSearchProductsResult {
  skus: Item[];
  pagination: Pagination | undefined;
  isLoading: boolean;
}

export function useSearchProducts(options: UseSearchProductsOptions = {}): UseSearchProductsResult {
  const { query: searchQuery = "", page = 1, limit = 20, filter, sort, enabled = true } = options;

  const rqQuery = useQuery({
    queryKey: ["searchProducts", { searchQuery, page, limit, filter, sort }],
    queryFn: async () => {
      const body: SearchProductsBody = { query: searchQuery, page, limit };
      if (filter) body.filter = filter;
      if (sort) body.sort = sort;

      const { data, error } = await getSdk().catalog.searchProducts(body);
      if (error) throw new Error(error.message);
      return data;
    },
    enabled,
  });

  return {
    skus: rqQuery.data?.skus ?? [],
    pagination: rqQuery.data?.pagination,
    isLoading: rqQuery.isLoading,
  };
}

// --- Similar Products ---

interface UseSimilarProductsResult {
  items: Item[];
  isLoading: boolean;
}

export function useSimilarProducts(productId: string): UseSimilarProductsResult {
  const query = useQuery({
    queryKey: ["similarProducts", productId],
    queryFn: async () => {
      const { data, error } = await getSdk().catalog.listSimilarProducts({
        product_id: [productId],
      });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!productId,
  });

  return {
    items: query.data?.products ?? [],
    isLoading: query.isLoading,
  };
}

// --- Product Detail (by slug or ID) ---

interface UseProductDetailResult {
  // Wider than `Product`: getProductDetail also returns the long-form `description`.
  product: SojaProductDetail | undefined;
  isLoading: boolean;
}

export function useProductDetail(
  slug: string,
  options: { enabled?: boolean } = {}
): UseProductDetailResult & { isError: boolean; refetch: () => void } {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ["productDetail", slug],
    queryFn: async () => {
      const { data, error } = await getSdk().catalog.getProductDetail({ product_id: slug });
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: enabled && !!slug,
  });

  return {
    product: query.data?.product,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: () => {
      void query.refetch();
    },
  };
}

// --- Categories ---

interface UseCategoriesResult {
  categories: Category[];
  isLoading: boolean;
}

export function useCategories(options: { enabled?: boolean } = {}): UseCategoriesResult {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await getSdk().catalog.listCategories();
      if (error) throw new Error(error.message);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  return {
    categories: query.data?.categories ?? [],
    isLoading: query.isLoading,
  };
}
