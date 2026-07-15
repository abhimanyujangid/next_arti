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

function hydrateKey(userId: string) {
  return `artisun.cart-wishlist.hydrated.${userId}`;
}

/**
 * On login: merge local → server once per tab session, then hydrate local from server.
 * Subsequent navigations only pull from server (no re-merge) so qty cannot double.
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
      // Only reset when logout is confirmed — not during brief session flips
      syncedUserId.current = null;
      return;
    }

    if (syncedUserId.current === user.id) return;
    syncedUserId.current = user.id;

    const run = async () => {
      const localCart = getCartSnapshot();
      const localWish = getWishlistSnapshot();
      const alreadyHydrated =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem(hydrateKey(user.id)) === "1";

      try {
        if (alreadyHydrated) {
          // Pull only — local already reflects prior sync + setItem calls
          const [cartData, wishData] = await Promise.all([
            utils.cart.get.fetch(),
            utils.wishlist.list.fetch(),
          ]);
          replaceCartItems(cartData.items as CartItem[]);
          replaceWishlistItems(wishData.items as WishItem[]);
          return;
        }

        if (localCart.length > 0) {
          const { items } = await cartReplace.mutateAsync({
            items: localCart.map((i) => ({
              productId: i.product_id,
              qty: i.qty,
            })),
            mode: "merge",
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

        window.sessionStorage.setItem(hydrateKey(user.id), "1");
      } catch (error) {
        console.error("Failed to sync cart/wishlist", error);
        syncedUserId.current = null;
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once per user mount
  }, [user?.id, loading]);

  useEffect(() => {
    if (loading || user) return;
    // Clear hydrate flags on logout so next login can merge guest cart
    try {
      const keys: string[] = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        if (key?.startsWith("artisun.cart-wishlist.hydrated.")) {
          keys.push(key);
        }
      }
      keys.forEach((key) => window.sessionStorage.removeItem(key));
    } catch {
      // ignore
    }
  }, [user, loading]);
}

export function CartWishlistSync() {
  useCartWishlistSync();
  return null;
}
