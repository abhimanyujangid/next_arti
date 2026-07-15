import Link from "next/link";

import { serverTrpc } from "@/lib/trpc/server";

export async function HomeCategories() {
  const caller = await serverTrpc();
  const categories = await caller.catalog.listCategories();

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
      <div className="mb-14 text-center">
        <div className="eyebrow">Shop by discipline</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          {categories.length
            ? `${categories.length} disciplines. One devotion.`
            : "Disciplines shaped by craft."}
        </h2>
      </div>
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Categories will appear here once published in admin.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-4 md:gap-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="group text-center"
            >
              <div className="aspect-[3/4] overflow-hidden bg-secondary/60">
                {c.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.coverUrl}
                    alt={c.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    {c.name}
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-xl transition-colors group-hover:text-accent">
                {c.name}
              </h3>
              <div className="mt-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                Explore →
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
