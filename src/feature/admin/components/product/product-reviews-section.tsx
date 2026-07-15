"use client";

import { Check, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  ProductReviewRow,
  ProductReviewStats,
} from "@/feature/admin/components/product/types";

export function ProductReviewsSection({
  reviews,
  reviewStats,
  isUpdating,
  onSetApproved,
  onDelete,
}: {
  reviews: ProductReviewRow[];
  reviewStats: ProductReviewStats;
  isUpdating: boolean;
  onSetApproved: (id: string, isApproved: boolean) => void;
  onDelete: (review: ProductReviewRow) => void;
}) {
  return (
    <section id="reviews" className="scroll-mt-8 border-t border-[#e5e5e0] pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            Collector reviews
          </div>
          <h2 className="mt-2 font-serif text-2xl text-[#1a1a1a]">
            {reviewStats.count === 0
              ? "No reviews yet"
              : `${reviewStats.average.toFixed(1)} · ${reviewStats.count} review${reviewStats.count === 1 ? "" : "s"}`}
          </h2>
          {reviewStats.pendingCount > 0 && (
            <p className="mt-1 text-xs text-amber-700">
              {reviewStats.pendingCount} awaiting approval
            </p>
          )}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="border border-dashed border-[#e5e5e0] bg-white px-6 py-10 text-center text-sm text-[#707065]">
          Reviews for this piece will appear here when collectors submit them.
        </p>
      ) : (
        <div className="border border-[#e5e5e0] bg-white">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-[#e5e5e0] px-4 py-4 last:border-b-0"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#707065]">
                    <span>{review.rating}/5</span>
                    <span>·</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      className={
                        review.isApproved
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }
                    >
                      {review.isApproved ? "Approved" : "Hidden"}
                    </span>
                  </div>
                  <div className="mt-2 font-medium text-[#1a1a1a]">
                    {review.title || "Untitled review"}
                  </div>
                  {review.body && (
                    <p className="mt-1 whitespace-pre-line text-sm text-[#4a4a40]">
                      {review.body}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-[#707065]">
                    {review.user.name} ({review.user.email})
                  </div>
                </div>

                <div className="flex shrink-0 gap-1">
                  {review.isApproved ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-none"
                      disabled={isUpdating}
                      onClick={() => onSetApproved(review.id, false)}
                    >
                      <X className="size-3.5" />
                      Hide
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-none"
                      disabled={isUpdating}
                      onClick={() => onSetApproved(review.id, true)}
                    >
                      <Check className="size-3.5" />
                      Approve
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-none text-destructive hover:text-destructive"
                    onClick={() => onDelete(review)}
                    aria-label="Delete review"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
