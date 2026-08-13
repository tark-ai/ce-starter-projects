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

/** The server fn throws bare, so the direction is reattached on the way out. */
async function toggleOnServer(adding: boolean, target: WishlistTarget) {
  try {
    return adding
      ? await addToWishlist({ data: target })
      : await removeWishlistItem({ data: target });
  } catch (cause) {
    throw new WishlistToggleError(cause, adding);
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const addListeners = useRef(new Set<() => void>());
  const reportedQueryError = useRef(false);
  // The last list the server confirmed, written inside the queue so the next queued
  // operation sees it. Reading react-query's cache here would race: setQueryData runs
  // in onSuccess, which is not ordered against the queue handing off to the next op.
  const confirmed = useRef<Item[] | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: WISHLIST_KEY,
    // Through the queue as well: a mutation's fresh list would otherwise be
    // overwritten by an initial read that started earlier and landed later.
    queryFn: () =>
      enqueue(async () => {
        await ensureClientSessionBootstrapped();
        const result = await fetchWishlist();
        confirmed.current = result.products;
        return result;
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

  // Deciding add-vs-remove outside the queue reads a snapshot the pending operation
  // has not updated yet, so two rapid clicks pick the same branch twice.
  const toggleMutation = useMutation({
    mutationFn: ({ productId, variantId }: WishlistTarget) =>
      enqueue(async () => {
        await ensureClientSessionBootstrapped();

        if (!confirmed.current) {
          // Guessing the direction against an unknown list would send an add for an
          // item that is already saved, leaving no way to remove it.
          confirmed.current = (await fetchWishlist()).products;
        }

        const adding = !containsItem(confirmed.current, productId, variantId);
        try {
          const result = await toggleOnServer(adding, { productId, variantId });

          confirmed.current = result?.products ?? [];
          return { result, adding };
        } catch (cause) {
          // A lost response may still have committed, so the snapshot can no longer
          // pick the next direction; force a fresh read.
          confirmed.current = null;
          throw cause;
        }
      }),
    onSuccess: ({ result, adding }) => {
      queryClient.setQueryData(WISHLIST_KEY, result);
      if (!adding) return;
      for (const listener of addListeners.current) listener();
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
        await ensureClientSessionBootstrapped();
        try {
          const result = await removeWishlistItem({ data: { productId, variantId } });
          confirmed.current = result?.products ?? [];
          return result;
        } catch (cause) {
          // Same as the toggle: a lost response may still have removed the item.
          confirmed.current = null;
          throw cause;
        }
      }),
    onSuccess: (result) => {
      queryClient.setQueryData(WISHLIST_KEY, result);
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
