"use client";

import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc/client";
import {
  useWishlist,
  type WishItem,
} from "@/feature/account/hooks/use-wishlist-store";

/** Local wishlist with optional server toggle when signed in. */
export function useSyncedWishlist() {
  const wish = useWishlist();
  const { user } = useAuth();
  const toggleMutation = trpc.wishlist.toggle.useMutation();

  return {
    ...wish,
    toggle(id: string, item: WishItem) {
      wish.toggle(id, item);
      if (user) toggleMutation.mutate({ productId: id });
    },
    remove(id: string) {
      if (wish.has(id)) {
        wish.remove(id);
        if (user) toggleMutation.mutate({ productId: id });
      }
    },
  };
}
