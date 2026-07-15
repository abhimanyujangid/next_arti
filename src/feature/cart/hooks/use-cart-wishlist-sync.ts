"use client";

import { useEffect, useRef } from "react";

import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc/client";
import {
  getCartSnapshot,
  replaceCartItems,
  type CartItem,
} from "@/feature/cart/hooks/use-cart-store";
import {
  getWishlistSnapshot,
  replaceWishlistItems,
  type WishItem,
} from "@/feature/account/hooks/use-wishlist-store";

/**
 * On login: merge local cart/wishlist into server, then hydrate local from server.
 * Runs once per session user id.
 */
export function useCartWishlistSync() {
  const { user, loading } = useAuth();
  const syncedUserId = useRef<string | null>(null);
  const utils = trpc.useUtils();

  const cartReplace = trpc.cart.replace.useMutation();
  const wishlistReplace = trpc.wishlist.replace.useMutation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    const run = async () => {
      const localCart = getCartSnapshot();
      const localWish = getWishlistSnapshot();

      try {
        if (localCart.length > 0) {
          const { items } = await cartReplace.mutateAsync({
            items: localCart.map((i) => ({
              productId: i.product_id,
              qty: i.qty,
            })),
          });
          replaceCartItems(items as CartItem[]);
        } else {
          const data = await utils.cart.get.fetch();
          replaceCartItems(data.items as CartItem[]);
        }

        if (localWish.length > 0) {
          const { items } = await wishlistReplace.mutateAsync({
            productIds: localWish.map((i) => i.product_id),
          });
          replaceWishlistItems(items as WishItem[]);
        } else {
          const data = await utils.wishlist.list.fetch();
          replaceWishlistItems(data.items as WishItem[]);
        }
      } catch (error) {
        console.error("Failed to sync cart/wishlist", error);
        syncedUserId.current = null;
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync once per user
  }, [user?.id, loading]);
}

export function CartWishlistSync() {
  useCartWishlistSync();
  return null;
}
