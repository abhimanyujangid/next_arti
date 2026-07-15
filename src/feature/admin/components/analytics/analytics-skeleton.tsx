import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-[320px] rounded-none border border-[#e5e5e0] bg-white ${i === 0 ? "lg:col-span-2" : ""}`}
        />
      ))}
    </div>
  );
}
