// Client-side cart store (localStorage, guest-friendly).
import { useSyncExternalStore } from "react";

export type CartItem = {
  product_id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  qty: number;
};

const KEY = "artisun.cart.v1";
const listeners = new Set<() => void>();

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useCart() {
  const items = useSyncExternalStore(subscribe, () => JSON.stringify(read()), () => "[]");
  const parsed = JSON.parse(items) as CartItem[];
  return {
    items: parsed,
    count: parsed.reduce((s, i) => s + i.qty, 0),
    subtotal: parsed.reduce((s, i) => s + i.price * i.qty, 0),
    add(item: CartItem) {
      const cur = read();
      const idx = cur.findIndex((c) => c.product_id === item.product_id);
      if (idx >= 0) cur[idx].qty += item.qty;
      else cur.push(item);
      write(cur);
    },
    setQty(product_id: string, qty: number) {
      const cur = read().map((c) => c.product_id === product_id ? { ...c, qty: Math.max(1, qty) } : c);
      write(cur);
    },
    remove(product_id: string) {
      write(read().filter((c) => c.product_id !== product_id));
    },
    clear() { write([]); },
  };
}
