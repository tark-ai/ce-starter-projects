import { toast } from "@ce/ui/components/ui/sonner";
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

type OnAddListener = () => void;

interface WishlistContextValue {
  items: Item[];
  count: number;
  isLoading: boolean;
  isInWishlist: (productId: string, variantId?: string | null) => boolean;
  toggleWishlist: (productId: string, variantId?: string | null) => void;
  removeFromWishlist: (productId: string, variantId?: string | null) => void;
  onAdd: (listener: OnAddListener) => () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = ["wishlist"];

function getWishlistErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const addListeners = useRef(new Set<OnAddListener>());
  const hasShownQueryError = useRef(false);

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
      hasShownQueryError.current = false;
      return;
    }

    if (hasShownQueryError.current) return;

    hasShownQueryError.current = true;
    toast.error(getWishlistErrorMessage(error, "We couldn't load your wishlist."));
  }, [error]);

  const addMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId?: string | null;
    }) => {
      const { data, error } = await sdk.cart.addToWishlist({
        product_id: productId,
        variant_id: variantId ?? null,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
      for (const fn of addListeners.current) fn();
    },
    onError: (mutationError) => {
      toast.error(
        getWishlistErrorMessage(mutationError, "We couldn't add this item to your wishlist.")
      );
    },
  });

  const removeMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId?: string | null;
    }) => {
      const { data, error } = await sdk.cart.removeFromWishlist({
        product_id: productId,
        variant_id: variantId ?? null,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
    },
    onError: (mutationError) => {
      toast.error(
        getWishlistErrorMessage(mutationError, "We couldn't remove this item from your wishlist.")
      );
    },
  });

  const isInWishlist = useCallback(
    (productId: string, variantId?: string | null) =>
      items.some((item) => {
        if (item.product_id !== productId) return false;
        if (!variantId) return true;
        return item.variant_id === variantId;
      }),
    [items]
  );

  const toggleWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      if (isInWishlist(productId, variantId)) {
        removeMutation.mutate({ productId, variantId });
      } else {
        addMutation.mutate({ productId, variantId });
      }
    },
    [isInWishlist, addMutation, removeMutation]
  );

  const removeFromWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      removeMutation.mutate({ productId, variantId });
    },
    [removeMutation]
  );

  const onAdd = useCallback((listener: OnAddListener) => {
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
      toggleWishlist,
      removeFromWishlist,
      onAdd,
    }),
    [items, isLoading, isInWishlist, toggleWishlist, removeFromWishlist, onAdd]
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
