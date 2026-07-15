"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyContent,
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

type JournalRow = {
  id: string;
  title: string;
  slug: string;
  coverUrl: string | null;
  isPublished: boolean;
  updatedAt: Date | string;
};

export function JournalView() {
  const utils = trpc.useUtils();
  const { data: posts = [], isLoading } = trpc.admin.journal.list.useQuery();

  const [deleting, setDeleting] = useState<JournalRow | null>(null);

  const deleteMutation = trpc.admin.journal.delete.useMutation({
    onSuccess: async () => {
      toast.success("Journal post deleted");
      setDeleting(null);
      await utils.admin.journal.list.invalidate();
      await utils.journal.list.invalidate();
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#1a1a1a]">Journal</h2>
          <p className="mt-2 text-sm tracking-wide text-[#707065]">
            Create and publish essays for The Journal.
          </p>
        </div>
        <Button asChild className="rounded-none">
          <Link href="/admin/journal/new">
            <Plus className="size-4" />
            New post
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="border border-[#e5e5e0] bg-white">
          <div className="grid grid-cols-[72px_1fr_110px_140px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Cover</span>
            <span>Title</span>
            <span>Status</span>
            <span>Updated</span>
            <span className="text-right">Actions</span>
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-[72px_1fr_110px_140px_120px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <Skeleton className="size-[56px] rounded-none" />
              <div className="min-w-0 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-none" />
                <Skeleton className="h-3 w-1/2 rounded-none" />
              </div>
              <Skeleton className="h-4 w-16 rounded-none" />
              <Skeleton className="h-4 w-20 rounded-none" />
              <div className="flex justify-end gap-1">
                <Skeleton className="size-8 rounded-none" />
                <Skeleton className="size-8 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpen />
            </EmptyMedia>
            <EmptyTitle>No journal posts yet</EmptyTitle>
            <EmptyDescription>
              Write the first essay to appear on /journal when published.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild className="rounded-none">
              <Link href="/admin/journal/new">
                <Plus className="size-4" />
                New post
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        <div className="border border-[#e5e5e0] bg-white">
          <div className="grid grid-cols-[72px_1fr_110px_140px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
            <span>Cover</span>
            <span>Title</span>
            <span>Status</span>
            <span>Updated</span>
            <span className="text-right">Actions</span>
          </div>

          {posts.map((post) => (
            <div
              key={post.id}
              className="grid grid-cols-[72px_1fr_110px_140px_120px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 last:border-b-0"
            >
              <div className="size-[56px] overflow-hidden border border-[#e5e5e0] bg-[#fafaf8]">
                {post.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-[10px] text-[#a3a39a]">
                    None
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="truncate font-medium text-[#1a1a1a]">
                  {post.title}
                </div>
                <div className="truncate text-xs text-[#707065]">
                  /journal/{post.slug}
                </div>
              </div>

              <div>
                <span
                  className={
                    post.isPublished
                      ? "text-xs uppercase tracking-[0.14em] text-[#1a1a1a]"
                      : "text-xs uppercase tracking-[0.14em] text-[#a3a39a]"
                  }
                >
                  {post.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="text-sm text-[#4a4a40]">
                {format(new Date(post.updatedAt), "MMM d, yyyy")}
              </div>

              <div className="flex justify-end gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none"
                  asChild
                >
                  <Link
                    href={`/admin/journal/${post.id}`}
                    aria-label={`Edit ${post.title}`}
                  >
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-none text-destructive hover:text-destructive"
                  onClick={() => setDeleting(post)}
                  aria-label={`Delete ${post.title}`}
                >
                  <Trash2 className="size-4" />
                </Button>
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
            <AlertDialogTitle>Delete journal post?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting
                ? `This will permanently delete “${deleting.title}” and its cover image.`
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
