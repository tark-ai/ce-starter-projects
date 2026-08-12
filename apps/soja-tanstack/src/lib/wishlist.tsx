import { createSerialQueue } from "@ce/soja-shared/lib/async-queue";
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
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist as removeWishlistItem,
} from "./server-fns/wishlist";
import { ensureClientSessionBootstrapped } from "./session-bootstrap";

interface WishlistContextValue extends SojaWishlistPanel {
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = ["wishlist"];

const enqueue = createSerialQueue();

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
    // Through the queue as well: a mutation's fresh list would otherwise be
    // overwritten by an initial read that started earlier and landed later.
    queryFn: () =>
      enqueue(async () => {
        await ensureClientSessionBootstrapped();
        return fetchWishlist();
      }),
    // The session cookie only exists in the browser.
    enabled: typeof window !== "undefined",
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
        await ensureClientSessionBootstrapped();
        return addToWishlist({ data: { productId, variantId } });
      }),
    onSuccess: (result) => {
      queryClient.setQueryData(WISHLIST_KEY, result);
      for (const listener of addListeners.current) listener();
    },
    onError: (mutationError) => {
      toast.error(errorMessage(mutationError, "We couldn't save this to your favourites."));
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ productId, variantId }: WishlistTarget) =>
      enqueue(async () => {
        await ensureClientSessionBootstrapped();
        return removeWishlistItem({ data: { productId, variantId } });
      }),
    onSuccess: (result) => {
      queryClient.setQueryData(WISHLIST_KEY, result);
    },
    onError: (mutationError) => {
      toast.error(errorMessage(mutationError, "We couldn't remove this from your favourites."));
    },
  });

  const isInWishlist = useCallback(
    (productId: string, variantId?: string | null) =>
      items.some((item: Item) => {
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
