"use client";

import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ReviewsView() {
  const { data: products = [], isLoading } =
    trpc.admin.reviews.listProductsWithReviews.useQuery();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div>
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Reviews</h2>
        <p className="mt-2 text-sm tracking-wide text-[#707065]">
          Open a product to moderate its collector reviews.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] w-full rounded-none" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareQuote />
            </EmptyMedia>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>
              Reviews submitted on product pages will appear here as product
              cards.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}#reviews`}
              className="group border border-[#e5e5e0] bg-white transition-colors hover:border-[#1a1a1a]"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#fafaf8]">
                {product.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.coverUrl}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#a3a39a]">
                    No image
                  </div>
                )}
              </div>
              <div className="border-t border-[#e5e5e0] px-4 py-3">
                <div className="truncate font-medium text-[#1a1a1a]">
                  {product.title}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#707065]">
                  <span>
                    {product.reviewStats.average.toFixed(1)} ·{" "}
                    {product.reviewStats.count} review
                    {product.reviewStats.count === 1 ? "" : "s"}
                  </span>
                  {product.reviewStats.pendingCount > 0 && (
                    <span className="border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-amber-800">
                      {product.reviewStats.pendingCount} pending
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
