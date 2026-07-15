"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { trpc } from "@/lib/trpc/client";
import { JournalForm } from "@/feature/admin/components/journal-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export function JournalEditView({ postId }: { postId: string }) {
  const router = useRouter();
  const { data, isLoading, isError } = trpc.admin.journal.getById.useQuery({
    id: postId,
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Skeleton className="h-4 w-28 rounded-none" />
        <Skeleton className="h-10 w-1/2 rounded-none" />
        <Skeleton className="h-64 w-full rounded-none" />
        <Skeleton className="h-40 w-full rounded-none" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl">
        <Empty className="border border-dashed border-[#e5e5e0] bg-white">
          <EmptyHeader>
            <EmptyTitle>Post not found</EmptyTitle>
            <EmptyDescription>
              This journal post may have been removed.
            </EmptyDescription>
          </EmptyHeader>
          <Button
            className="mt-4 rounded-none"
            variant="outline"
            onClick={() => router.push("/admin/journal")}
          >
            <ArrowLeft className="size-4" />
            Back to journal
          </Button>
        </Empty>
      </div>
    );
  }

  return <JournalForm post={data} />;
}
