import type { Item } from "@commercengine/storefront";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useRef } from "react";
import { sdk } from "./storefront";

type OnAddListener = () => void;

interface WishlistContextValue {
  items: Item[];
  count: number;
  isLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string, variantId?: string | null) => void;
  removeFromWishlist: (productId: string, variantId?: string | null) => void;
  onAdd: (listener: OnAddListener) => () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const WISHLIST_KEY = ["wishlist"];

export function WishlistProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const addListeners = useRef(new Set<OnAddListener>());

  const { data, isLoading } = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: async () => {
      const userId = await sdk.getUserId();
      if (!userId) return { products: [] as Item[] };
      const { data, error } = await sdk.cart.getWishlist({ user_id: userId });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const items = data?.products ?? [];

  const addMutation = useMutation({
    mutationFn: async ({
      productId,
      variantId,
    }: {
      productId: string;
      variantId?: string | null;
    }) => {
      const userId = await sdk.getUserId();
      if (!userId) throw new Error("Not authenticated");
      const { data, error } = await sdk.cart.addToWishlist(
        { user_id: userId },
        { product_id: productId, variant_id: variantId ?? null }
      );
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
      for (const fn of addListeners.current) fn();
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
      const userId = await sdk.getUserId();
      if (!userId) throw new Error("Not authenticated");
      const { data, error } = await sdk.cart.removeFromWishlist(
        { user_id: userId },
        { product_id: productId, variant_id: variantId ?? null }
      );
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(WISHLIST_KEY, data);
    },
  });

  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.product_id === productId),
    [items]
  );

  const toggleWishlist = useCallback(
    (productId: string, variantId?: string | null) => {
      if (isInWishlist(productId)) {
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

// biome-ignore lint/style/useComponentExportOnlyModules: we need to export the useWishlist function
export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
