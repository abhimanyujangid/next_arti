import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <Skeleton className="h-4 w-32 rounded-none" />
      <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
        <Skeleton className="aspect-[4/5] w-full rounded-none" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4 rounded-none" />
          <Skeleton className="h-6 w-1/2 rounded-none" />
          <Skeleton className="h-24 w-full rounded-none" />
        </div>
      </div>
    </div>
  );
}
