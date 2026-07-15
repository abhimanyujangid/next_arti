import type { ReactNode } from "react";

function formatDayLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

export function ChartPanel({
  title,
  description,
  children,
  empty,
  className = "",
}: {
  title: string;
  description?: string;
  children: ReactNode;
  empty?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`border border-[#e5e5e0] bg-white p-5 ${className}`}
    >
      <div className="mb-4">
        <h3 className="font-serif text-xl text-[#1a1a1a]">{title}</h3>
        {description && (
          <p className="mt-1 text-xs tracking-wide text-[#707065]">
            {description}
          </p>
        )}
      </div>
      {empty ? (
        <div className="flex h-[280px] items-center justify-center border border-dashed border-[#e5e5e0] text-sm text-[#707065]">
          No data for this period.
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export { formatDayLabel };
