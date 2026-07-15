"use client";

import Link from "next/link";

import { formatINR } from "@/lib/format";
import { calcGst, calcOrderTotal } from "@/lib/pricing";
import type { CartItem } from "@/feature/cart/hooks/use-cart-store";

export function CheckoutSummary({
  items,
  subtotal,
  isPaying,
  canPay,
  onPay,
}: {
  items: CartItem[];
  subtotal: number;
  isPaying: boolean;
  canPay: boolean;
  onPay: () => void;
}) {
  const gst = calcGst(subtotal);
  const total = calcOrderTotal({ subtotal, shipping: 0 });

  return (
    <aside className="space-y-4 border border-border/60 p-8">
      <div className="eyebrow">Summary</div>

      <ul className="divide-y divide-border/60 border-y border-border/60">
        {items.map((it) => (
          <li key={it.product_id} className="flex gap-4 py-4">
            <Link
              href={`/product/${it.slug}`}
              className="aspect-[4/5] w-16 shrink-0 overflow-hidden bg-secondary/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                alt={it.title}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-base">{it.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Qty {it.qty} · {formatINR(it.price)}
              </div>
            </div>
            <div className="font-display text-base">
              {formatINR(it.price * it.qty)}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span>{formatINR(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping</span>
        <span>Complimentary</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">GST (18%)</span>
        <span>{formatINR(gst)}</span>
      </div>
      <hr className="gold-rule" />
      <div className="flex justify-between font-display text-xl">
        <span>Total</span>
        <span>{formatINR(total)}</span>
      </div>

      <button
        type="button"
        disabled={!canPay || isPaying}
        onClick={onPay}
        className="mt-2 w-full bg-foreground py-4 text-xs uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPaying ? "Processing…" : "Pay with Razorpay"}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Insured shipping · Provenance card included
      </p>
    </aside>
  );
}
