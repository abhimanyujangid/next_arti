import { Skeleton } from "@/components/ui/skeleton";

export function HomeCategoriesSkeleton() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
      <div className="mb-14 text-center">
        <div className="eyebrow">Shop by discipline</div>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          Disciplines shaped by craft.
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-4 md:gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="aspect-[3/4] w-full rounded-none bg-secondary/60" />
            <Skeleton className="mx-auto mt-5 h-6 w-2/3 rounded-none" />
            <Skeleton className="mx-auto mt-2 h-3 w-20 rounded-none" />
          </div>
        ))}
      </div>
    </section>
  );
}
