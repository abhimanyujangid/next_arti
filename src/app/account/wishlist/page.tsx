"use client";

import Link from "next/link";
import { AccountNav } from "@/feature/account/components/account-layout";
import { useWishlist } from "@/feature/account/hooks/use-wishlist-store";
import { useCart } from "@/feature/cart/hooks/use-cart-store";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";

export default function WishlistPage() {
  const wish = useWishlist();
  const cart = useCart();

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <AccountNav isAdmin={false} />
        <section>
          <div className="eyebrow">Wishlist</div>
          <h1 className="mt-2 font-display text-4xl">Saved for later</h1>
          {wish.items.length === 0 ? (
            <div className="mt-10 border border-border/60 p-10 text-center">
              <div className="font-display text-2xl">Nothing saved yet.</div>
              <Link href="/shop" className="mt-4 inline-block text-xs uppercase tracking-[0.22em] border-b border-accent pb-1">
                Browse the collection →
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {wish.items.map((w) => (
                <div key={w.product_id} className="group">
                  <Link href={`/product/${w.slug}`} className="block aspect-[4/5] overflow-hidden bg-secondary/60">
                    <img
                      src={w.image}
                      alt={w.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </Link>
                  <h3 className="mt-4 font-display text-xl">{w.title}</h3>
                  <div className="text-sm mt-1">{formatINR(w.price)}</div>
                  <div className="mt-4 flex gap-4 text-xs uppercase tracking-[0.22em]">
                    <button
                      onClick={() => {
                        cart.add({ ...w, qty: 1 });
                        toast.success("Added to cart");
                      }}
                      className="border-b border-accent pb-1 hover:text-accent cursor-pointer"
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={() => wish.remove(w.product_id)}
                      className="text-muted-foreground hover:text-destructive cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
