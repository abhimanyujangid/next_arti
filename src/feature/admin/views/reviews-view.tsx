"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, MessageSquareQuote, Trash2, X } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isApproved: boolean;
  createdAt: Date | string;
  product: { id: string; title: string; slug: string };
  user: { id: string; name: string; email: string };
};

export function ReviewsView() {
  const utils = trpc.useUtils();
  const { data: reviews = [], isLoading } = trpc.admin.reviews.list.useQuery();
  const [deleting, setDeleting] = useState<ReviewRow | null>(null);

  const setApproved = trpc.admin.reviews.setApproved.useMutation({
    onSuccess: async (_data, vars) => {
      toast.success(vars.isApproved ? "Review approved" : "Review hidden");
      await utils.admin.reviews.list.invalidate();
      await utils.catalog.listReviews.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.admin.reviews.delete.useMutation({
    onSuccess: async () => {
      toast.success("Review deleted");
      setDeleting(null);
      await utils.admin.reviews.list.invalidate();
      await utils.catalog.listReviews.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div>
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Reviews</h2>
        <p className="mt-2 text-sm tracking-wide text-[#707065]">
          Moderate collector reviews across the catalog.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3 border border-[#e5e5e0] bg-white p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-none" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageSquareQuote />
            </EmptyMedia>
            <EmptyTitle>No reviews yet</EmptyTitle>
            <EmptyDescription>
              Reviews submitted on product pages will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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
                    <p className="mt-1 line-clamp-3 text-sm text-[#4a4a40]">
                      {review.body}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-[#707065]">
                    <Link
                      href={`/product/${review.product.slug}`}
                      className="underline-offset-2 hover:text-accent hover:underline"
                      target="_blank"
                    >
                      {review.product.title}
                    </Link>
                    {" · "}
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
                      disabled={setApproved.isPending}
                      onClick={() =>
                        setApproved.mutate({
                          id: review.id,
                          isApproved: false,
                        })
                      }
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
                      disabled={setApproved.isPending}
                      onClick={() =>
                        setApproved.mutate({
                          id: review.id,
                          isApproved: true,
                        })
                      }
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
                    onClick={() => setDeleting(review)}
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

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete review?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `This permanently deletes the review by ${deleting.user.name}.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (!deleting) return;
                deleteMutation.mutate({ id: deleting.id });
              }}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
