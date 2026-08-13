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
import { getSdk, whenStorefrontReady } from "./storefront-client";

interface WishlistContextValue extends SojaWishlistPanel {
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = ["wishlist"];

const enqueue = createSerialQueue();

/**
 * Module-scoped: each island mounts its own provider, so a provider-local set would
 * never reach the header's panel listener registered from a different island.
 */
const addListeners = new Set<() => void>();

/**
 * The last list the server confirmed, written inside the queue so the next queued
 * operation sees it. Reading react-query's cache here would race: setQueryData runs
 * in onSuccess, which is not ordered against the queue handing off to the next op.
 * Module-scoped like the queue, or one island would decide against another's stale copy.
 */
let confirmed: Item[] | null = null;

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

function containsItem(items: Item[], productId: string, variantId?: string | null): boolean {
  return items.some((item) => {
    if (item.product_id !== productId) return false;
    return variantId ? item.variant_id === variantId : true;
  });
}

/** Carries the direction out of the queue: onError cannot tell which branch ran. */
class WishlistToggleError extends Error {
  constructor(
    cause: unknown,
    readonly adding: boolean
  ) {
    // Empty fallback so onError still picks the direction-specific message.
    super(errorMessage(cause, ""));
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const reportedQueryError = useRef(false);

  const { data, error, isLoading } = useQuery({
    queryKey: WISHLIST_KEY,
    // Through the queue as well: a mutation's fresh list would otherwise be
    // overwritten by an initial read that started earlier and landed later.
    queryFn: () =>
      enqueue(async () => {
        await whenStorefrontReady();
        const { data, error } = await getSdk().cart.getWishlist();
        if (error) throw new Error(error.message);
        confirmed = data?.products ?? [];
        return data ?? { products: [] as Item[] };
      }),
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

  // Deciding add-vs-remove outside the queue reads a snapshot the pending operation
  // has not updated yet, so two rapid clicks pick the same branch twice.
  const toggleMutation = useMutation({
    mutationFn: ({ productId, variantId }: WishlistTarget) =>
      enqueue(async () => {
        await whenStorefrontReady();
        const sdk = getSdk();

        if (!confirmed) {
          // Guessing the direction against an unknown list would send an add for an
          // item that is already saved, leaving no way to remove it.
          const { data, error } = await sdk.cart.getWishlist();
          if (error) throw new Error(error.message);
          confirmed = data?.products ?? [];
        }

        const adding = !containsItem(confirmed, productId, variantId);
        const body = { product_id: productId, variant_id: variantId ?? null };
        // Wrapping the call itself, not just a returned error, so a rejection still
        // carries the direction out to onError.
        try {
          const { data, error } = adding
            ? await sdk.cart.addToWishlist(body)
            : await sdk.cart.removeFromWishlist(body);
          if (error) throw error;

          confirmed = data?.products ?? [];
          return { data, adding };
        } catch (cause) {
          // A lost response may still have committed, so the snapshot can no longer
          // pick the next direction; force a fresh read.
          confirmed = null;
          throw new WishlistToggleError(cause, adding);
        }
      }),
    onSuccess: ({ data, adding }) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
      if (!adding) return;
      for (const listener of addListeners) listener();
    },
    onError: (mutationError) => {
      // The write may have landed anyway, so resync rather than leave the list diverged.
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      const removing = mutationError instanceof WishlistToggleError && !mutationError.adding;
      toast.error(
        errorMessage(
          mutationError,
          removing
            ? "We couldn't remove this from your favourites."
            : "We couldn't save this to your favourites."
        )
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ productId, variantId }: WishlistTarget) =>
      enqueue(async () => {
        await whenStorefrontReady();
        try {
          const { data, error } = await getSdk().cart.removeFromWishlist({
            product_id: productId,
            variant_id: variantId ?? null,
          });
          if (error) throw new Error(error.message);
          confirmed = data?.products ?? [];
          return data;
        } catch (cause) {
          // Same as the toggle: a lost response may still have removed the item.
          confirmed = null;
          throw cause;
        }
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
    },
    onError: (mutationError) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      toast.error(errorMessage(mutationError, "We couldn't remove this from your favourites."));
    },
  });

  // Display only: the rendered snapshot, never the toggle decision.
  const isInWishlist = useCallback(
    (productId: string, variantId?: string | null) => containsItem(items, productId, variantId),
    [items]
  );

  const onToggleWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      toggleMutation.mutate({ productId, variantId });
    },
    [toggleMutation]
  );

  const removeFromWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      removeMutation.mutate({ productId, variantId });
    },
    [removeMutation]
  );

  const registerOnAdd = useCallback((listener: () => void) => {
    addListeners.add(listener);
    return () => {
      addListeners.delete(listener);
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
