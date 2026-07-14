"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState, useMemo } from "react";
import { ProductCard } from "./product-card";
import type { CatalogProductCard } from "../api/utils";
import { trpc } from "@/lib/trpc/client";

export const PRICE_BUCKETS = [
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹50,000", min: 10000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "Over ₹1,00,000", min: 100000, max: Infinity },
];

// Mock products database for fully functional frontend filtering
const mockProducts: CatalogProductCard[] = [
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
  {
    id: "prod-3",
    slug: "blue-pottery-vase",
    title: "Jaipur Blue Pottery Floral Vase",
    short_desc: "Hand-glazed traditional blue pottery quartz vase.",
    price_original: 4500,
    price_discounted: null,
    region: "Jaipur, Rajasthan",
    material: "Clay & Quartz",
    is_available: true,
    stock: 10,
    category_slug: "ceramics",
    category_name: "Ceramics",
    image_url: "/images/product-blue-pottery.jpg",
  },
  {
    id: "prod-4",
    slug: "dhokra-tribal-musicians",
    title: "Dhokra Brass Musicians (Set of 3)",
    short_desc: "Lost-wax cast brass tribal figures.",
    price_original: 8500,
    price_discounted: null,
    region: "Bastar, Chhattisgarh",
    material: "Brass",
    is_available: true,
    stock: 5,
    category_slug: "metal-art",
    category_name: "Brass & Bronze",
    image_url: "/images/product-dhokra.jpg",
  },
  {
    id: "prod-5",
    slug: "madhubani-tree-of-life",
    title: "Tree of Life Madhubani Painting",
    short_desc: "Natural pigment painting on handmade paper.",
    price_original: 18000,
    price_discounted: 16500,
    region: "Mithila, Bihar",
    material: "Handmade Paper & Ink",
    is_available: true,
    stock: 2,
    category_slug: "paintings",
    category_name: "Paintings",
    image_url: "/images/product-madhubani.jpg",
  },
  {
    id: "prod-6",
    slug: "kashmiri-sozni-cushion",
    title: "Sozni Hand-embroidered Cushion Cover",
    short_desc: "Pure wool cushion cover with fine sozni needlework.",
    price_original: 4500,
    price_discounted: null,
    region: "Srinagar, Kashmir",
    material: "Wool & Cotton",
    is_available: true,
    stock: 12,
    category_slug: "textiles",
    category_name: "Heirloom Textiles",
    image_url: "/images/product-kashmiri-cushion.jpg",
  },
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
  {
    id: "prod-8",
    slug: "pichwai-shrinathji",
    title: "Shrinathji Pichwai Painting on Cloth",
    short_desc: "Hand-painted deity image with gold dust details.",
    price_original: 45000,
    price_discounted: null,
    region: "Nathdwara, Rajasthan",
    material: "Cloth & Natural Pigments",
    is_available: false,
    stock: 0,
    category_slug: "paintings",
    category_name: "Paintings",
    image_url: "/images/product-silk-painting.jpg",
  },
  {
    id: "prod-9",
    slug: "palm-leaf-ramayana",
    title: "Engraved Palm Leaf Ramayana Manuscript",
    short_desc: "Traditional Tala Parcha Chitra engraving.",
    price_original: 14000,
    price_discounted: 12000,
    region: "Raghurajpur, Odisha",
    material: "Dried Palm Leaf",
    is_available: true,
    stock: 2,
    category_slug: "paintings",
    category_name: "Paintings",
    image_url: "/images/product-palm-leaf.jpg",
  },
  {
    id: "prod-10",
    slug: "warli-canvas-painting",
    title: "Warli Harvest Celebration Painting",
    short_desc: "Rice paste painting depicting tribal dance.",
    price_original: 9500,
    price_discounted: null,
    region: "Jawhar, Maharashtra",
    material: "Canvas & Rice Paste",
    is_available: true,
    stock: 4,
    category_slug: "paintings",
    category_name: "Paintings",
    image_url: "/images/product-warli.jpg",
  },
];

export function ShopCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: liveCategories = [] } = trpc.catalog.listCategories.useQuery();

  const categories = useMemo(
    () => [
      { slug: "", label: "All works" },
      ...liveCategories.map((c) => ({ slug: c.slug, label: c.name })),
    ],
    [liveCategories],
  );

  // Parse filters from query params
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  const availableOnly = searchParams.get("availableOnly") === "true";

  const updateSearch = (patch: Record<string, string | number | boolean | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    if (!patch.page) {
      params.set("page", "1");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  // Perform Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (category) {
      result = result.filter((p) => p.category_slug === category);
    }

    if (minPrice !== null) {
      result = result.filter((p) => (p.price_discounted ?? p.price_original) >= minPrice);
    }
    if (maxPrice !== null) {
      result = result.filter((p) => (p.price_discounted ?? p.price_original) <= maxPrice);
    }

    if (q) {
      const lower = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(lower) ||
          (p.short_desc?.toLowerCase().includes(lower) ?? false) ||
          (p.region?.toLowerCase().includes(lower) ?? false)
      );
    }

    if (availableOnly) {
      result = result.filter((p) => p.is_available);
    }

    // Sort
    if (sort === "newest") {
      // Static mock array stays same or reverse
    } else if (sort === "price-asc") {
      result.sort((a, b) => (a.price_discounted ?? a.price_original) - (b.price_discounted ?? b.price_original));
    } else if (sort === "price-desc") {
      result.sort((a, b) => (b.price_discounted ?? b.price_original) - (a.price_discounted ?? a.price_original));
    } else if (sort === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [category, minPrice, maxPrice, q, sort, availableOnly]);

  const perPage = 6;
  const total = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredProducts.slice(start, start + perPage);
  }, [filteredProducts, page]);

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-12 md:pt-16 pb-24">
      <header className="mb-10 md:mb-14">
        <div className="eyebrow">The collection</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Every piece, one of one</h1>
      </header>

      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        {/* SIDEBAR FILTERS */}
        <aside className="space-y-8 text-sm">
          <div>
            <div className="eyebrow mb-4">Discipline</div>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.slug || "all"}>
                  <button
                    onClick={() => updateSearch({ category: c.slug })}
                    className={
                      "text-left hover:text-accent transition-colors " +
                      (category === c.slug ? "text-accent font-medium" : "text-foreground")
                    }
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Price</div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => updateSearch({ minPrice: null, maxPrice: null })}
                  className={"text-left hover:text-accent " + (minPrice === null && maxPrice === null ? "text-accent font-medium" : "")}
                >
                  Any price
                </button>
              </li>
              {PRICE_BUCKETS.map((b) => (
                <li key={b.label}>
                  <button
                    onClick={() => updateSearch({ minPrice: b.min, maxPrice: b.max })}
                    className={
                      "text-left hover:text-accent " +
                      (minPrice === b.min && maxPrice === b.max ? "text-accent font-medium" : "")
                    }
                  >
                    {b.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-4">Availability</div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => updateSearch({ availableOnly: e.target.checked ? "true" : "" })}
                className="rounded border-border focus:ring-accent accent-accent"
              />
              <span>In stock only</span>
            </label>
          </div>

          <div>
            <div className="eyebrow mb-4">Search</div>
            <input
              value={q}
              onChange={(e) => updateSearch({ q: e.target.value })}
              placeholder="Search works…"
              className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
        </aside>

        {/* GRID */}
        <section>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
            <span className="text-sm text-muted-foreground">
              {total} {total === 1 ? "work" : "works"} found
            </span>
            <label className="flex items-center gap-2 text-sm">
              <span className="eyebrow">Sort</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => updateSearch({ sort: e.target.value })}
                  className="appearance-none border-b border-foreground/30 bg-transparent pr-6 py-1 text-sm focus:outline-none focus:border-accent cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="title">A – Z</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
              </div>
            </label>
          </div>

          {paginatedProducts.length === 0 ? (
            <div className="py-24 text-center">
              <div className="font-display text-2xl">No works match those filters.</div>
              <button
                onClick={() => router.push(pathname)}
                className="mt-4 text-xs uppercase tracking-[0.22em] border-b border-accent pb-1"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.22em]">
              <button
                disabled={page <= 1}
                onClick={() => updateSearch({ page: Math.max(1, page - 1) })}
                className="disabled:opacity-30 hover:text-accent disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-muted-foreground">Page {page} of {totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => updateSearch({ page: page + 1 })}
                className="disabled:opacity-30 hover:text-accent disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
