import { Skeleton } from "@/components/ui/skeleton";

export function UserDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <Skeleton className="h-4 w-28 rounded-none" />
      <div className="flex gap-6">
        <Skeleton className="size-20 rounded-none" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-9 w-1/2 rounded-none" />
          <Skeleton className="h-4 w-1/3 rounded-none" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-none" />
      <Skeleton className="h-40 w-full rounded-none" />
    </div>
  );
}
