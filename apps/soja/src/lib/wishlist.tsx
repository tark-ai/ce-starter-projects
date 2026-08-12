import type { SojaWishlistPanel } from "@ce/soja-shared/lib/wishlist";
import { toast } from "@ce/soja-ui/components/ui/sonner";
import type { Item } from "@commercengine/storefront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { sdk } from "./storefront";

interface WishlistContextValue extends SojaWishlistPanel {
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = ["wishlist"];

/**
 * Each mutation returns the whole list, so overlapping requests could commit out of
 * order. Chaining them keeps the server as the single writer of that ordering.
 */
let mutationQueue: Promise<unknown> = Promise.resolve();

function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.catch(() => undefined);
  return result;
}

interface WishlistTarget {
  productId: string;
  variantId?: string | null;
}

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    const { message } = error as { message: unknown };
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const addListeners = useRef(new Set<() => void>());
  const reportedQueryError = useRef(false);

  const { data, error, isLoading } = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: async () => {
      const { data, error } = await sdk.cart.getWishlist();
      if (error) throw new Error(error.message);
      return data ?? { products: [] as Item[] };
    },
  });

  const items = data?.products ?? [];

  useEffect(() => {
    if (!error) {
      reportedQueryError.current = false;
      return;
    }
    if (reportedQueryError.current) return;
    reportedQueryError.current = true;
    toast.error(errorMessage(error, "We couldn't load your favourites."));
  }, [error]);

  const addMutation = useMutation({
    mutationFn: ({ productId, variantId }: WishlistTarget) =>
      enqueue(async () => {
        const { data, error } = await sdk.cart.addToWishlist({
          product_id: productId,
          variant_id: variantId ?? null,
        });
        if (error) throw new Error(error.message);
        return data;
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
      for (const listener of addListeners.current) listener();
    },
    onError: (mutationError) => {
      toast.error(errorMessage(mutationError, "We couldn't save this to your favourites."));
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ productId, variantId }: WishlistTarget) =>
      enqueue(async () => {
        const { data, error } = await sdk.cart.removeFromWishlist({
          product_id: productId,
          variant_id: variantId ?? null,
        });
        if (error) throw new Error(error.message);
        return data;
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
    },
    onError: (mutationError) => {
      toast.error(errorMessage(mutationError, "We couldn't remove this from your favourites."));
    },
  });

  const isInWishlist = useCallback(
    (productId: string, variantId?: string | null) =>
      items.some((item) => {
        if (item.product_id !== productId) return false;
        return variantId ? item.variant_id === variantId : true;
      }),
    [items]
  );

  const onToggleWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      const mutation = isInWishlist(productId, variantId) ? removeMutation : addMutation;
      mutation.mutate({ productId, variantId });
    },
    [isInWishlist, addMutation, removeMutation]
  );

  const removeFromWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      removeMutation.mutate({ productId, variantId });
    },
    [removeMutation]
  );

  const registerOnAdd = useCallback((listener: () => void) => {
    addListeners.current.add(listener);
    return () => {
      addListeners.current.delete(listener);
    };
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      count: items.length,
      isLoading,
      isInWishlist,
      onToggleWishlist,
      removeFromWishlist,
      registerOnAdd,
    }),
    [items, isLoading, isInWishlist, onToggleWishlist, removeFromWishlist, registerOnAdd]
  );

  return <WishlistContext value={value}>{children}</WishlistContext>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
