import Link from "next/link";

import type { UserReviewRow } from "@/feature/admin/components/user/types";

export function UserReviews({ reviews }: { reviews: UserReviewRow[] }) {
  return (
    <section>
      <h2 className="font-serif text-2xl text-[#1a1a1a]">Reviews</h2>
      {reviews.length === 0 ? (
        <p className="mt-4 border border-dashed border-[#e5e5e0] bg-white px-6 py-8 text-center text-sm text-[#707065]">
          No reviews yet.
        </p>
      ) : (
        <div className="mt-4 border border-[#e5e5e0] bg-white">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-[#e5e5e0] px-4 py-4 last:border-b-0"
            >
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
                    review.isApproved ? "text-emerald-700" : "text-amber-700"
                  }
                >
                  {review.isApproved ? "Approved" : "Hidden"}
                </span>
              </div>
              <div className="mt-2 font-medium text-[#1a1a1a]">
                {review.title || "Untitled review"}
              </div>
              {review.body && (
                <p className="mt-1 text-sm text-[#4a4a40]">{review.body}</p>
              )}
              <div className="mt-2 text-xs text-[#707065]">
                <Link
                  href={`/admin/products/${review.product.id}`}
                  className="underline-offset-2 hover:text-accent hover:underline"
                >
                  {review.product.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
