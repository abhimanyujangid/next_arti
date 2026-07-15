"use client";

import { useQueryStates } from "nuqs";

import {
  ORDERS_RANGE_VALUES,
  ORDERS_STATUS_VALUES,
  ordersSearchParams,
  type OrdersRange,
  type OrdersStatusFilter,
} from "@/feature/admin/lib/orders-params";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RANGE_LABELS: Record<OrdersRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  all: "All time",
};

const STATUS_LABELS: Record<OrdersStatusFilter, string> = {
  all: "All statuses",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function OrdersFilters() {
  const [filters, setFilters] = useQueryStates(ordersSearchParams, {
    history: "push",
    shallow: false,
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#707065]">
          Period
        </span>
        {ORDERS_RANGE_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => void setFilters({ range: value, page: 1 })}
            className={
              "border px-3 py-1.5 text-xs uppercase tracking-[0.14em] transition-colors " +
              (filters.range === value
                ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                : "border-[#e5e5e0] bg-white text-[#707065] hover:border-[#1a1a1a] hover:text-[#1a1a1a]")
            }
          >
            {RANGE_LABELS[value]}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#707065]">
          Status
        </span>
        <Select
          value={filters.status}
          onValueChange={(value) => {
            if (
              !ORDERS_STATUS_VALUES.includes(
                value as (typeof ORDERS_STATUS_VALUES)[number],
              )
            ) {
              return;
            }
            void setFilters({
              status: value as OrdersStatusFilter,
              page: 1,
            });
          }}
        >
          <SelectTrigger className="h-9 w-[180px] rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-none">
            {ORDERS_STATUS_VALUES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
