import Link from "next/link";

import { ProductCard } from "@/feature/catalog/components/product-card";
import { serverTrpc } from "@/lib/trpc/server";

export async function HomeBestsellers() {
  const caller = await serverTrpc();
  const { items } = await caller.catalog.listProducts({
    bestSeller: true,
    pageSize: 4,
    page: 1,
    sort: "newest",
  });

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-24 md:pb-32">
        <div className="eyebrow">Most collected</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          Pieces that find homes quickly
        </h2>
        <p className="mt-6 text-muted-foreground">
          Best sellers will appear here once marked in admin.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-24 md:pb-32">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Most collected</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Pieces that find homes quickly
          </h2>
        </div>
        <Link
          href="/shop"
          className="border-b border-accent pb-1 text-xs uppercase tracking-[0.22em] hover:text-accent"
        >
          Browse all →
        </Link>
      </div>
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
