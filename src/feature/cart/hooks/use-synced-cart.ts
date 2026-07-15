"use client";

import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc/client";
import {
  getCartSnapshot,
  useCart,
  type CartItem,
} from "@/feature/cart/hooks/use-cart-store";

/** Local cart with optional server setItem when signed in. */
export function useSyncedCart() {
  const cart = useCart();
  const { user } = useAuth();
  const setItem = trpc.cart.setItem.useMutation();
  const clearMutation = trpc.cart.clear.useMutation();

  const syncQty = (productId: string, qty: number) => {
    if (!user) return;
    setItem.mutate({ productId, qty });
  };

  return {
    ...cart,
    add(item: CartItem) {
      cart.add(item);
      const line = getCartSnapshot().find(
        (c) => c.product_id === item.product_id,
      );
      if (line) syncQty(item.product_id, line.qty);
    },
    setQty(product_id: string, qty: number) {
      cart.setQty(product_id, qty);
      const line = getCartSnapshot().find((c) => c.product_id === product_id);
      syncQty(product_id, line?.qty ?? qty);
    },
    remove(product_id: string) {
      cart.remove(product_id);
      syncQty(product_id, 0);
    },
    clear() {
      cart.clear();
      if (user) clearMutation.mutate();
    },
  };
}
