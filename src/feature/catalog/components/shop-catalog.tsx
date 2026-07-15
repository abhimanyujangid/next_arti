"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useQueryStates } from "nuqs";

import { ProductCard } from "./product-card";
import { shopSearchParams } from "@/feature/catalog/lib/params";
import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

export const PRICE_BUCKETS = [
  { label: "Under ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹50,000", min: 10000, max: 50000 },
  { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
  { label: "Over ₹1,00,000", min: 100000, max: null as number | null },
] as const;

const PAGE_SIZE = 6;

export function ShopCatalog() {
  const [filters, setFilters] = useQueryStates(shopSearchParams, {
    history: "push",
    shallow: false,
  });

  const [searchInput, setSearchInput] = useState(filters.q);

  useEffect(() => {
    setSearchInput(filters.q);
  }, [filters.q]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      if (searchInput === filters.q) return;
      void setFilters({ q: searchInput, page: 1 });
    }, 300);
    return () => window.clearTimeout(handle);
  }, [searchInput, filters.q, setFilters]);

  const { data: liveCategories = [] } = trpc.catalog.listCategories.useQuery();
  const { data, isLoading, isFetching } = trpc.catalog.listProducts.useQuery({
    category: filters.category || undefined,
    q: filters.q || undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    availableOnly: filters.availableOnly,
    sort: filters.sort,
    page: filters.page,
    pageSize: PAGE_SIZE,
  });

  const categories = [
    { slug: "", label: "All works" },
    ...liveCategories.map((c) => ({ slug: c.slug, label: c.name })),
  ];

  const products = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const patchFilters = (patch: {
    category?: string;
    q?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
    sort?: "newest" | "price-asc" | "price-desc" | "title";
    page?: number;
    availableOnly?: boolean;
  }) => {
    void setFilters({
      ...patch,
      page: patch.page ?? 1,
    });
  };

  const resetFilters = () => {
    void setFilters({
      category: "",
      q: "",
      minPrice: null,
      maxPrice: null,
      sort: "newest",
      page: 1,
      availableOnly: false,
    });
    setSearchInput("");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-12 md:pt-16 pb-24">
      <header className="mb-10 md:mb-14">
        <div className="eyebrow">The collection</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">
          Every piece, one of one
        </h1>
      </header>

      <div className="grid gap-10 md:grid-cols-[240px_1fr]">
        <aside className="space-y-8 text-sm md:sticky md:top-24 md:self-start">
          <div>
            <div className="eyebrow mb-4">Discipline</div>
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.slug || "all"}>
                  <button
                    type="button"
                    onClick={() => patchFilters({ category: c.slug })}
                    className={
                      "text-left transition-colors hover:text-accent " +
                      (filters.category === c.slug
                        ? "font-medium text-accent"
                        : "text-foreground")
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
                  type="button"
                  onClick={() =>
                    patchFilters({ minPrice: null, maxPrice: null })
                  }
                  className={
                    "text-left hover:text-accent " +
                    (filters.minPrice === null && filters.maxPrice === null
                      ? "font-medium text-accent"
                      : "")
                  }
                >
                  Any price
                </button>
              </li>
              {PRICE_BUCKETS.map((b) => (
                <li key={b.label}>
                  <button
                    type="button"
                    onClick={() =>
                      patchFilters({ minPrice: b.min, maxPrice: b.max })
                    }
                    className={
                      "text-left hover:text-accent " +
                      (filters.minPrice === b.min &&
                      filters.maxPrice === b.max
                        ? "font-medium text-accent"
                        : "")
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
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={filters.availableOnly}
                onChange={(e) =>
                  patchFilters({ availableOnly: e.target.checked })
                }
                className="rounded border-border accent-accent focus:ring-accent"
              />
              <span>In stock only</span>
            </label>
          </div>

          <div>
            <div className="eyebrow mb-4">Search</div>
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search works…"
              className="w-full border-b border-foreground/30 bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </aside>

        <section>
          <div className="mb-8 flex items-center justify-between border-b border-border/60 pb-4">
            <span className="text-sm text-muted-foreground">
              {isLoading
                ? <Skeleton className="h-4 w-24" />
                : `${total} ${total === 1 ? "work" : "works"} found`}
              {isFetching && !isLoading ? " · Updating" : ""}
            </span>
            <label className="flex items-center gap-2 text-sm">
              <span className="eyebrow">Sort</span>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    patchFilters({
                      sort: e.target.value as
                        | "newest"
                        | "price-asc"
                        | "price-desc"
                        | "title",
                    })
                  }
                  className="appearance-none cursor-pointer border-b border-foreground/30 bg-transparent py-1 pr-6 text-sm focus:border-accent focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                  <option value="title">A – Z</option>
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2" />
              </div>
            </label>
          </div>

          {isLoading ? (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] w-full rounded-none bg-secondary/60" />
                  <Skeleton className="mt-4 h-5 w-3/4 rounded-none" />
                  <Skeleton className="mt-2 h-4 w-1/2 rounded-none" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <div className="font-display text-2xl">
                No works match those filters.
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 border-b border-accent pb-1 text-xs uppercase tracking-[0.22em]"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && !isLoading ? (
            <div className="mt-16 flex items-center justify-center gap-4 text-xs uppercase tracking-[0.22em]">
              <button
                type="button"
                disabled={filters.page <= 1}
                onClick={() =>
                  void setFilters({ page: Math.max(1, filters.page - 1) })
                }
                className="hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-muted-foreground">
                Page {filters.page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={filters.page >= totalPages}
                onClick={() =>
                  void setFilters({ page: filters.page + 1 })
                }
                className="hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
