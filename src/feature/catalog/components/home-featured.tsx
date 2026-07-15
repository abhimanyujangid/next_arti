import Link from "next/link";

import { ProductCard } from "@/feature/catalog/components/product-card";
import { serverTrpc } from "@/lib/trpc/server";

export async function HomeFeatured() {
  const caller = await serverTrpc();
  const { items } = await caller.catalog.listProducts({
    featured: true,
    pageSize: 3,
    page: 1,
    sort: "newest",
  });

  if (items.length === 0) {
    return (
      <section className="border-y border-border/60 bg-secondary/40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="eyebrow">Featured masterpieces</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Signed by their makers
          </h2>
          <p className="mt-6 text-muted-foreground">
            Featured works will appear here once marked in admin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Featured masterpieces</div>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Signed by their makers
            </h2>
          </div>
          <Link
            href="/shop"
            className="border-b border-accent pb-1 text-xs uppercase tracking-[0.22em] hover:text-accent"
          >
            View all →
          </Link>
        </div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
