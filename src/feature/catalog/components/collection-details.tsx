"use client";

import { useMemo } from "react";
import { ProductCard } from "./product-card";
import type { CatalogProductCard } from "@/feature/catalog/api/utils";

// Mock collection data
const mockCollectionDetails = [
  {
    slug: "featured-masterpieces",
    name: "Featured Masterpieces",
    description: "Our signature collection of one-of-one traditional masterworks.",
    coverUrl: "/images/product-tanjore.jpg",
    items: [
      {
        id: "prod-1",
        slug: "tanjore-saraswati",
        title: "Goddess Saraswati Tanjore Masterpiece",
        short_desc: "22k Gold leaf with semi-precious stones on teak wood.",
        price_original: 68000,
        price_discounted: null,
        region: "Tanjore, Tamil Nadu",
        material: "Gold Leaf on Teak",
        is_available: true,
        stock: 1,
        category_slug: "paintings",
        category_name: "Paintings",
        image_url: "/images/product-tanjore.jpg",
      },
      {
        id: "prod-2",
        slug: "chola-bronze-nataraja",
        title: "Lost-Wax Bronze Nataraja",
        short_desc: "Hand-cast traditional Chola style bronze sculpture.",
        price_original: 120000,
        price_discounted: 110000,
        region: "Swamimalai, Tamil Nadu",
        material: "Bronze",
        is_available: true,
        stock: 1,
        category_slug: "metal-art",
        category_name: "Brass & Bronze",
        image_url: "/images/product-brass-diya.jpg",
      },
    ],
  },
  {
    slug: "living-room-heirlooms",
    name: "Living Room Heirlooms",
    description: "Rare accent carvings, brass vessels and heritage pieces.",
    coverUrl: "/images/product-wood-panel.jpg",
    items: [
      {
        id: "prod-7",
        slug: "teak-jali-wall-panel",
        title: "Hand-carved Teak Jali Panel",
        short_desc: "Intricately carved floral geometric teak panel.",
        price_original: 32000,
        price_discounted: null,
        region: "Saharanpur, Uttar Pradesh",
        material: "Teak Wood",
        is_available: true,
        stock: 1,
        category_slug: "wood-art",
        category_name: "Wood Art",
        image_url: "/images/product-wood-panel.jpg",
      },
    ],
  },
];

export function CollectionDetails({ slug }: { slug: string }) {
  const collectionData = useMemo(() => {
    return mockCollectionDetails.find((c) => c.slug === slug) || mockCollectionDetails[0];
  }, [slug]);

  return (
    <div>
      <section className="relative h-[46vh] min-h-[320px] overflow-hidden">
        <img
          src={collectionData.coverUrl}
          alt={collectionData.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/70" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1400px] flex-col justify-end px-6 md:px-10 pb-14">
          <div className="eyebrow">Collection</div>
          <h1 className="mt-3 font-display text-4xl md:text-6xl">{collectionData.name}</h1>
          {collectionData.description && (
            <p className="mt-3 text-foreground/85 max-w-2xl">{collectionData.description}</p>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {collectionData.items.map((p) => (
          <ProductCard key={p.id} product={p as CatalogProductCard} />
        ))}
      </div>
    </div>
  );
}
