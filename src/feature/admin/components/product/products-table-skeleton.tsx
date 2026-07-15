import { Skeleton } from "@/components/ui/skeleton";

const GRID =
  "grid grid-cols-[72px_1fr_120px_80px_80px_120px_140px] gap-4 border-b border-[#e5e5e0] px-4 py-3";

export function ProductsTableSkeleton() {
  return (
    <div className="border border-[#e5e5e0] bg-white">
      <div
        className={`${GRID} text-[10px] uppercase tracking-[0.18em] text-[#707065]`}
      >
        <span>Image</span>
        <span>Title</span>
        <span>Category</span>
        <span>Stock</span>
        <span>Reviews</span>
        <span>Price</span>
        <span className="text-right">Actions</span>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`${GRID} items-center last:border-b-0`}>
          <Skeleton className="size-[56px] rounded-none" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4 rounded-none" />
            <Skeleton className="h-3 w-1/2 rounded-none" />
          </div>
          <Skeleton className="h-4 w-16 rounded-none" />
          <Skeleton className="h-4 w-8 rounded-none" />
          <Skeleton className="h-4 w-8 rounded-none" />
          <Skeleton className="h-4 w-16 rounded-none" />
          <div className="flex justify-end gap-1">
            <Skeleton className="size-8 rounded-none" />
            <Skeleton className="size-8 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
