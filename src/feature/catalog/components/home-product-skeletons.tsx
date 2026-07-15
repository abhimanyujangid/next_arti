import { Skeleton } from "@/components/ui/skeleton";

export function HomeFeaturedSkeleton() {
  return (
    <section className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <div className="mb-12">
          <div className="eyebrow">Featured masterpieces</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">
            Signed by their makers
          </h2>
        </div>
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[4/5] w-full rounded-none bg-secondary/60" />
              <Skeleton className="mt-4 h-5 w-3/4 rounded-none" />
              <Skeleton className="mt-2 h-4 w-1/2 rounded-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeBestsellersSkeleton() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-24 md:pb-32">
      <div className="mb-12">
        <div className="eyebrow">Most collected</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          Pieces that find homes quickly
        </h2>
      </div>
      <div className="grid gap-x-6 gap-y-14 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[4/5] w-full rounded-none bg-secondary/60" />
            <Skeleton className="mt-4 h-5 w-3/4 rounded-none" />
            <Skeleton className="mt-2 h-4 w-1/2 rounded-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
