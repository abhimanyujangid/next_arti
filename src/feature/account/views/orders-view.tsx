"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc/client";
import { formatINR } from "@/lib/format";
import { AccountNav } from "@/feature/account/components/account-layout";
import { Skeleton } from "@/components/ui/skeleton";

export function OrdersView() {
  const searchParams = useSearchParams();
  const { data: orders = [], isLoading } = trpc.orders.myList.useQuery();

  useEffect(() => {
    if (searchParams.get("placed") === "1") {
      toast.success("Thank you — your order is confirmed.");
    }
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <AccountNav isAdmin={false} />
        <section className="text-sm">
          <div className="eyebrow">Orders</div>
          <h1 className="mt-2 font-display text-4xl">Your orders</h1>

          {isLoading ? (
            <div className="mt-8 space-y-4">
              <Skeleton className="h-16 w-full rounded-none" />
              <Skeleton className="h-16 w-full rounded-none" />
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-10 border border-border/60 p-10 text-center">
              <div className="font-display text-2xl">No orders yet.</div>
              <Link
                href="/shop"
                className="mt-4 inline-block border-b border-accent pb-1 text-xs uppercase tracking-[0.22em]"
              >
                Browse the collection →
              </Link>
            </div>
          ) : (
            <ul className="mt-8 divide-y divide-border/60 border-y border-border/60">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/account/orders/${o.id}`}
                    className="flex items-center justify-between gap-4 py-5 transition-colors hover:bg-muted/30 focus-visible:bg-muted/30 focus-visible:outline-none"
                  >
                    <div>
                      <span className="font-display text-lg font-semibold text-foreground">
                        {o.orderNumber}
                      </span>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {format(new Date(o.createdAt), "d MMM yyyy")} ·{" "}
                        {o.items.length} item
                        {o.items.length === 1 ? "" : "s"}
                        {o.items[0] ? ` · ${o.items[0].titleSnapshot}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg">
                        {formatINR(o.total)}
                      </div>
                      <div className="mt-1 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-accent">
                        {o.status}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
