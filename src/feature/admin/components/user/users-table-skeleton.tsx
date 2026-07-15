import { Skeleton } from "@/components/ui/skeleton";

const GRID =
  "grid grid-cols-[48px_1fr_80px_80px_80px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3";

export function UsersTableSkeleton() {
  return (
    <div className="border border-[#e5e5e0] bg-white">
      <div
        className={`${GRID} text-[10px] uppercase tracking-[0.18em] text-[#707065]`}
      >
        <span />
        <span>User</span>
        <span>Role</span>
        <span>Orders</span>
        <span>Reviews</span>
        <span>Joined</span>
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`${GRID} items-center last:border-b-0`}
        >
          <Skeleton className="size-10 rounded-none" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-none" />
            <Skeleton className="h-3 w-1/2 rounded-none" />
          </div>
          <Skeleton className="h-4 w-12 rounded-none" />
          <Skeleton className="h-4 w-8 rounded-none" />
          <Skeleton className="h-4 w-8 rounded-none" />
          <Skeleton className="h-4 w-20 rounded-none" />
        </div>
      ))}
    </div>
  );
}
