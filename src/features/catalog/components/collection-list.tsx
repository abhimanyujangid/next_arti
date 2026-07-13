"use client";

import Link from "next/link";

const mockCollections = [
  {
    id: "col-1",
    slug: "featured-masterpieces",
    name: "Featured Masterpieces",
    description: "Our signature collection of one-of-one traditional masterworks.",
    coverUrl: "/images/product-tanjore.jpg",
  },
  {
    id: "col-2",
    slug: "living-room-heirlooms",
    name: "Living Room Heirlooms",
    description: "Rare accent carvings, brass vessels and heritage pieces.",
    coverUrl: "/images/product-wood-panel.jpg",
  },
];

export function CollectionList() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      <header className="mb-12 text-center">
        <div className="eyebrow">Curated by our house</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Collections</h1>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        {mockCollections.map((c) => (
          <Link key={c.id} href={`/collections/${c.slug}`} className="group">
            <div className="aspect-[16/10] overflow-hidden bg-secondary/60">
              <img
                src={c.coverUrl}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <h2 className="mt-5 font-display text-2xl md:text-3xl group-hover:text-accent">{c.name}</h2>
            {c.description && <p className="mt-2 text-muted-foreground max-w-md">{c.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
