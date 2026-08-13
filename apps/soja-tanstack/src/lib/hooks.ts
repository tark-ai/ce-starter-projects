import type { SojaProductDetail } from "@ce/soja-shared/lib/product-meta";
import type { Category, Item, Pagination, SearchProductsBody } from "@commercengine/storefront";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCategories,
  fetchListSkus,
  fetchProductDetail,
  fetchSimilarProducts,
} from "./server-fns/catalog";
import { searchProducts } from "./server-fns/search";

// --- List SKUs ---

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

  const query = useQuery({
    queryKey: ["listSkus", { page, limit, category_id }],
    queryFn: () => fetchListSkus({ data: { page, limit, category_id } }),
    enabled,
  });

  return {
    skus: query.data?.skus ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
  };
}

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

  const query = useQuery({
    queryKey: ["searchProducts", { searchQuery, page, limit, filter, sort }],
    queryFn: () => searchProducts({ data: { query: searchQuery, page, limit, filter, sort } }),
    enabled,
  });

  return {
    skus: query.data?.skus ?? [],
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
  };
}

// --- Similar Products ---

export function useSimilarProducts(productId: string): { items: Item[]; isLoading: boolean } {
  const query = useQuery({
    queryKey: ["similarProducts", productId],
    queryFn: () => fetchSimilarProducts({ data: productId }),
    enabled: !!productId,
  });

  return { items: query.data ?? [], isLoading: query.isLoading };
}

// --- Product Detail (by slug or ID) ---

export function useProductDetail(
  slug: string,
  options: { enabled?: boolean } = {}
): {
  // Wider than `Product`: getProductDetail also returns the long-form `description`.
  product: SojaProductDetail | undefined;
  isLoading: boolean;
} {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ["productDetail", slug],
    queryFn: () => fetchProductDetail({ data: slug }),
    enabled: enabled && !!slug,
  });

  return { product: query.data ?? undefined, isLoading: query.isLoading };
}

// --- Categories ---

export function useCategories(options: { enabled?: boolean } = {}): {
  categories: Category[];
  isLoading: boolean;
} {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });

  return { categories: query.data ?? [], isLoading: query.isLoading };
}
