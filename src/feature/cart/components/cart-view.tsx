"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncedCart } from "@/feature/cart/hooks/use-synced-cart";
import { formatINR } from "@/lib/format";
import { Trash2, Minus, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function CartView() {
  const cart = useSyncedCart();
  const { user } = useAuth();
  const router = useRouter();
  const shipping = cart.subtotal > 0 ? 0 : 0; // free across India
  const total = cart.subtotal + shipping;

  const checkout = () => {
    if (!user) {
      router.push("/auth?redirect=/checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-[1200px] px-6 md:px-10 pt-12 pb-24">
      <header className="mb-10">
        <div className="eyebrow">Cart</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Your selection</h1>
      </header>

      {cart.items.length === 0 ? (
        <div className="py-20 text-center border-y border-border/60">
          <div className="font-display text-2xl">Your cart is empty.</div>
          <Link href="/shop" className="mt-4 inline-block text-xs uppercase tracking-[0.22em] border-b border-accent pb-1 hover:text-accent">
            Browse the collection →
          </Link>
        </div>
      ) : (
        <div className="grid gap-14 lg:grid-cols-[1fr_360px] items-start">
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {cart.items.map((it) => (
              <li key={it.product_id} className="flex gap-6 py-6">
                <Link href={`/product/${it.slug}`} className="w-24 md:w-32 shrink-0 aspect-[4/5] overflow-hidden bg-secondary/60">
                  <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1">
                  <Link href={`/product/${it.slug}`} className="font-display text-xl leading-tight hover:text-accent">
                    {it.title}
                  </Link>
                  <div className="mt-1 text-sm text-muted-foreground">{formatINR(it.price)}</div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center border border-foreground/30">
                      <button onClick={() => cart.setQty(it.product_id, it.qty - 1)} className="p-2 hover:text-accent" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                      <span className="w-8 text-center text-sm">{it.qty}</span>
                      <button onClick={() => cart.setQty(it.product_id, it.qty + 1)} className="p-2 hover:text-accent" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => cart.remove(it.product_id)} className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent flex items-center gap-1.5">
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                </div>
                <div className="font-display text-lg">{formatINR(it.price * it.qty)}</div>
              </li>
            ))}
          </ul>

          <aside className="border border-border/60 p-8 space-y-4">
            <div className="eyebrow">Summary</div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>Complimentary</span>
            </div>
            <hr className="gold-rule" />
            <div className="flex justify-between font-display text-xl">
              <span>Total</span><span>{formatINR(total)}</span>
            </div>
            <button
              onClick={checkout}
              className="w-full mt-2 bg-foreground text-background py-4 text-xs uppercase tracking-[0.24em] hover:bg-accent transition-colors"
            >
              Proceed to checkout
            </button>
            <p className="text-xs text-muted-foreground text-center">Insured shipping · Provenance card included</p>
          </aside>
        </div>
      )}
    </div>
  );
}
