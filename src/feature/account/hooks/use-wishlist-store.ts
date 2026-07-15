import { useSyncExternalStore } from "react";

export type WishItem = {
  product_id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
};

const KEY = "artisun.wishlist.v1";
const listeners = new Set<() => void>();

function read(): WishItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: WishItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

export function getWishlistSnapshot(): WishItem[] {
  return read();
}

export function replaceWishlistItems(items: WishItem[]) {
  write(items);
}

export function useWishlist() {
  const raw = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(read()),
    () => "[]",
  );
  const items = JSON.parse(raw) as WishItem[];
  return {
    items,
    count: items.length,
    has(id: string) {
      return items.some((i) => i.product_id === id);
    },
    toggle(id: string, item: WishItem) {
      const cur = read();
      if (cur.some((i) => i.product_id === id)) {
        write(cur.filter((i) => i.product_id !== id));
      } else {
        write([...cur, item]);
      }
    },
    remove(id: string) {
      write(read().filter((i) => i.product_id !== id));
    },
    clear() {
      write([]);
    },
  };
}
