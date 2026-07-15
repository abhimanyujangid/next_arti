"use client";

import { useQueryStates } from "nuqs";

import {
  ANALYTICS_RANGE_VALUES,
  analyticsSearchParams,
  type AnalyticsRange,
} from "@/feature/admin/lib/analytics-params";

const LABELS: Record<AnalyticsRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  all: "All time",
};

export function AnalyticsRangeFilter() {
  const [filters, setFilters] = useQueryStates(analyticsSearchParams, {
    history: "push",
    shallow: false,
  });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[10px] uppercase tracking-[0.18em] text-[#707065]">
        Period
      </span>
      {ANALYTICS_RANGE_VALUES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => void setFilters({ range: value })}
          className={
            "border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors " +
            (filters.range === value
              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
              : "border-[#e5e5e0] bg-white text-[#707065] hover:border-[#1a1a1a] hover:text-[#1a1a1a]")
          }
        >
          {LABELS[value]}
        </button>
      ))}
    </div>
  );
}

export function useAnalyticsRange() {
  const [filters] = useQueryStates(analyticsSearchParams, {
    history: "push",
    shallow: false,
  });
  return filters.range;
}
