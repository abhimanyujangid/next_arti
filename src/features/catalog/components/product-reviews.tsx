"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface ReviewItem {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author_name: string;
  created_at: string;
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5 text-accent" aria-label={`${value} out of 5`}>
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
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // In-memory mock reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "rev-1",
      rating: 5,
      title: "Absolutely breathtaking craftsmanship",
      body: "I was hesitant about shipping such a delicate work, but the museum packaging was immaculate. The painting itself is a masterpiece. The details of the gold leaf work are even more vibrant in person.",
      author_name: "Aravind Swamy",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rev-2",
      rating: 4,
      title: "Beautiful addition to our living room",
      body: "Stunning colors and details. It carries a heavy presence of ancient heritage. Highly recommended concierge service too, they helped answer all my questions.",
      author_name: "Meera Sen",
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const newReview: ReviewItem = {
      id: `mock-rev-${Date.now()}`,
      rating,
      title,
      body,
      author_name: user?.name || "Collector",
      created_at: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    toast.success("Thank you for your review");
    setTitle("");
    setBody("");
  };

  const removeMyReview = () => {
    setReviews(reviews.filter((r) => !r.id.startsWith("mock-rev-")));
    toast.success("Review removed");
  };

  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return (
    <section className="mt-24">
      <div className="eyebrow">Collector reviews</div>
      <div className="mt-3 flex flex-wrap items-baseline gap-4">
        <h2 className="font-display text-3xl md:text-4xl">
          {count === 0 ? "Be the first to review" : `${average.toFixed(1)} · ${count} review${count === 1 ? "" : "s"}`}
        </h2>
        {count > 0 && <Stars value={average} size={18} />}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-8">
          {count === 0 && (
            <p className="text-muted-foreground">No reviews yet. Yours would grace this page beautifully.</p>
          )}
          {reviews.map((r) => (
            <article key={r.id} className="border-b border-border/60 pb-8">
              <div className="flex items-center gap-3">
                <Stars value={r.rating} />
                <span className="eyebrow">{new Date(r.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
              </div>
              {r.title && <h3 className="mt-3 font-display text-xl">{r.title}</h3>}
              {r.body && <p className="mt-2 text-foreground/85 leading-relaxed whitespace-pre-line">{r.body}</p>}
              <div className="mt-3 text-sm text-muted-foreground">— {r.author_name}</div>
            </article>
          ))}
        </div>

        <aside className="bg-secondary/40 p-8 text-sm">
          <div className="eyebrow">Share your impressions</div>
          {!user ? (
            <p className="mt-4 text-sm text-muted-foreground">
              <Link href="/auth" className="text-accent underline underline-offset-4">Sign in</Link> to leave a review.
            </p>
          ) : (
            <form onSubmit={submitReview} className="mt-4 space-y-4">
              <div>
                <label className="eyebrow block mb-2">Rating</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setRating(n)}
                      className="p-1 text-accent"
                      aria-label={`Rate ${n}`}
                    >
                      <Star className={"h-6 w-6 " + (n <= rating ? "fill-current" : "opacity-30")} strokeWidth={1.2} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="eyebrow block mb-2">Headline</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={120}
                  className="w-full bg-background border border-border px-3 py-2 focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="eyebrow block mb-2">Your review</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  className="w-full bg-background border border-border px-3 py-2 focus:outline-none focus:border-accent resize-none"
                  required
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="bg-foreground text-background px-5 py-3 text-xs uppercase tracking-[0.24em] hover:bg-accent hover:text-primary-foreground transition-colors"
                >
                  Submit review
                </button>
                <button
                  type="button"
                  onClick={removeMyReview}
                  className="text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-accent transition-colors"
                >
                  Remove mine
                </button>
              </div>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}

export { Stars as ReviewStars };
