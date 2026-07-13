"use client";

import Link from "next/link";
import { AccountNav } from "@/feature/account/components/account-layout";
import { formatINR } from "@/lib/format";
import { format } from "date-fns";

const mockOrders = [
  {
    id: "ord-1",
    order_number: "AS-2026-98401",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    total: 68000,
    status: "Delivered",
    order_items: [
      { id: "item-1", title: "Goddess Saraswati Tanjore Masterpiece" },
    ],
  },
  {
    id: "ord-2",
    order_number: "AS-2026-98105",
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    total: 8500,
    status: "Delivered",
    order_items: [
      { id: "item-2", title: "Dhokra Brass Musicians (Set of 3)" },
    ],
  },
];

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <AccountNav isAdmin={false} />
        <section className="text-sm">
          <div className="eyebrow">Orders</div>
          <h1 className="mt-2 font-display text-4xl">Your orders</h1>
          {mockOrders.length === 0 ? (
            <div className="mt-10 border border-border/60 p-10 text-center">
              <div className="font-display text-2xl">No orders yet.</div>
              <Link href="/shop" className="mt-4 inline-block text-xs uppercase tracking-[0.22em] border-b border-accent pb-1">
                Browse the collection →
              </Link>
            </div>
          ) : (
            <ul className="mt-8 divide-y divide-border/60 border-y border-border/60">
              {mockOrders.map((o) => (
                <li key={o.id} className="py-5 flex items-center justify-between gap-4">
                  <div>
                    <span className="font-display text-lg text-foreground hover:text-accent font-semibold">
                      {o.order_number}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(o.created_at), "d MMM yyyy")} · {o.order_items.length} item{o.order_items.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-lg">{formatINR(o.total)}</div>
                    <div className="mt-1 text-[0.65rem] uppercase tracking-[0.22em] text-accent font-medium">{o.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
