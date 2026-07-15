"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc/client";

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div
      className="inline-flex items-center gap-0.5 text-accent"
      aria-label={`${value} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          style={{ width: size, height: size }}
          className={n <= Math.round(value) ? "fill-current" : "opacity-30"}
          strokeWidth={1.2}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.catalog.listReviews.useQuery({ productId });

  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const myReview = data?.myReview ?? null;

  useEffect(() => {
    if (myReview) {
      setRating(myReview.rating);
      setTitle(myReview.title ?? "");
      setBody(myReview.body ?? "");
    } else {
      setRating(5);
      setTitle("");
      setBody("");
    }
  }, [myReview]);

  const upsertMutation = trpc.catalog.upsertReview.useMutation({
    onSuccess: async () => {
      toast.success(
        myReview ? "Review updated" : "Thank you for your review",
      );
      await utils.catalog.listReviews.invalidate({ productId });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.catalog.deleteMyReview.useMutation({
    onSuccess: async () => {
      toast.success("Review removed");
      setRating(5);
      setTitle("");
      setBody("");
      await utils.catalog.listReviews.invalidate({ productId });
    },
    onError: (error) => toast.error(error.message),
  });

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    upsertMutation.mutate({
      productId,
      rating,
      title: title.trim(),
      body: body.trim(),
    });
  };

  const removeMyReview = () => {
    deleteMutation.mutate({ productId });
  };

  const reviews = data?.items ?? [];
  const count = data?.count ?? 0;
  const average = data?.average ?? 0;
  const isSaving = upsertMutation.isPending || deleteMutation.isPending;

  const authHref = `/auth?redirect=${encodeURIComponent(pathname)}`;

  return (
    <section className="mt-24">
      <div className="eyebrow">Collector reviews</div>
      <div className="mt-3 flex flex-wrap items-baseline gap-4">
        <h2 className="font-display text-3xl md:text-4xl">
          {isLoading
            ? "Loading reviews…"
            : count === 0
              ? "Be the first to review"
              : `${average.toFixed(1)} · ${count} review${count === 1 ? "" : "s"}`}
        </h2>
        {!isLoading && count > 0 && <Stars value={average} size={18} />}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8">
          {isLoading ? (
            <p className="text-muted-foreground">Loading reviews…</p>
          ) : count === 0 ? (
            <p className="text-muted-foreground">
              No reviews yet. Yours would grace this page beautifully.
            </p>
          ) : (
            reviews.map((r) => (
              <article key={r.id} className="border-b border-border/60 pb-8">
                <div className="flex items-center gap-3">
                  <Stars value={r.rating} />
                  <span className="eyebrow">
                    {new Date(r.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {r.title && (
                  <h3 className="mt-3 font-display text-xl">{r.title}</h3>
                )}
                {r.body && (
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-foreground/85">
                    {r.body}
                  </p>
                )}
                <div className="mt-3 text-sm text-muted-foreground">
                  — {r.author_name}
                </div>
              </article>
            ))
          )}
        </div>

        <aside className="bg-secondary/40 p-8 text-sm">
          <div className="eyebrow">Share your impressions</div>
          {!user ? (
            <p className="mt-4 text-sm text-muted-foreground">
              <Link
                href={authHref}
                className="text-accent underline underline-offset-4"
              >
                Sign in
              </Link>{" "}
              to leave a review.
            </p>
          ) : (
            <form onSubmit={submitReview} className="mt-4 space-y-4">
              <div>
                <label className="eyebrow mb-2 block">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setRating(n)}
                      className="p-1 text-accent"
                      aria-label={`Rate ${n}`}
                      disabled={isSaving}
                    >
                      <Star
                        className={
                          "h-6 w-6 " + (n <= rating ? "fill-current" : "opacity-30")
                        }
                        strokeWidth={1.2}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="eyebrow mb-2 block">Headline</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  className="w-full border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none"
                  required
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="eyebrow mb-2 block">Your review</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none border border-border bg-background px-3 py-2 focus:border-accent focus:outline-none"
                  required
                  minLength={10}
                  disabled={isSaving}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-foreground px-5 py-3 text-xs uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent hover:text-primary-foreground disabled:opacity-50"
                >
                  {upsertMutation.isPending
                    ? "Saving…"
                    : myReview
                      ? "Update review"
                      : "Submit review"}
                </button>
                {myReview && (
                  <button
                    type="button"
                    onClick={removeMyReview}
                    disabled={isSaving}
                    className="text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-accent disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Removing…" : "Remove mine"}
                  </button>
                )}
              </div>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}

export { Stars as ReviewStars };
