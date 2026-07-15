"use client";

import { useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useQueryStates } from "nuqs";

import { trpc } from "@/lib/trpc/client";
import { formatINR } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ORDERS_PAGE_SIZE,
  ordersSearchParams,
  type OrdersSortBy,
} from "@/feature/admin/lib/orders-params";
import { OrdersFilters } from "@/feature/admin/components/order/orders-filters";
import { OrdersPagination } from "@/feature/admin/components/order/orders-pagination";

export function OrdersListView() {
  const [filters, setFilters] = useQueryStates(ordersSearchParams, {
    history: "push",
    shallow: false,
  });

  const { data, isLoading } = trpc.admin.orders.list.useQuery({
    page: filters.page,
    pageSize: ORDERS_PAGE_SIZE,
    range: filters.range,
    status: filters.status,
    sortBy: filters.sortBy,
    sortDir: filters.sortDir,
  });

  const orders = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / ORDERS_PAGE_SIZE));

  useEffect(() => {
    if (filters.page > totalPages) {
      void setFilters({ page: totalPages });
    }
  }, [filters.page, totalPages, setFilters]);

  function toggleSort(column: OrdersSortBy) {
    if (filters.sortBy === column) {
      void setFilters({
        sortDir: filters.sortDir === "asc" ? "desc" : "asc",
        page: 1,
      });
      return;
    }
    void setFilters({
      sortBy: column,
      sortDir: column === "orderNumber" ? "asc" : "desc",
      page: 1,
    });
  }

  function sortIndicator(column: OrdersSortBy) {
    if (filters.sortBy !== column) return null;
    return filters.sortDir === "asc" ? " ↑" : " ↓";
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div>
        <h2 className="font-serif text-3xl text-[#1a1a1a]">Orders</h2>
        <p className="mt-2 text-sm tracking-wide text-[#707065]">
          Manage and fulfill customer orders.
        </p>
      </div>

      <OrdersFilters />

      {isLoading ? (
        <div className="border border-[#e5e5e0] bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-14 w-full rounded-none border-b border-[#e5e5e0]"
            />
          ))}
        </div>
      ) : total === 0 ? (
        <div className="border border-dashed border-[#e5e5e0] bg-white px-6 py-12 text-center text-sm text-[#707065]">
          No orders match these filters.
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto border border-[#e5e5e0] bg-white">
            <div className="grid min-w-[760px] grid-cols-[1.2fr_1.4fr_100px_100px_80px_120px] gap-4 border-b border-[#e5e5e0] px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#707065]">
              <button
                type="button"
                onClick={() => toggleSort("orderNumber")}
                className="text-left transition-colors hover:text-[#1a1a1a]"
              >
                Order{sortIndicator("orderNumber")}
              </button>
              <span>Customer</span>
              <span>Status</span>
              <button
                type="button"
                onClick={() => toggleSort("total")}
                className="text-left transition-colors hover:text-[#1a1a1a]"
              >
                Total{sortIndicator("total")}
              </button>
              <span>Items</span>
              <button
                type="button"
                onClick={() => toggleSort("createdAt")}
                className="text-left transition-colors hover:text-[#1a1a1a]"
              >
                Date{sortIndicator("createdAt")}
              </button>
            </div>
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="grid min-w-[760px] grid-cols-[1.2fr_1.4fr_100px_100px_80px_120px] items-center gap-4 border-b border-[#e5e5e0] px-4 py-3 text-sm last:border-b-0 transition-colors hover:bg-[#fafaf8]"
              >
                <span className="font-medium text-[#1a1a1a]">
                  {order.orderNumber}
                </span>
                <span className="min-w-0 truncate text-[#4a4a40]">
                  {order.user.name}
                  <span className="block truncate text-xs text-[#707065]">
                    {order.user.email}
                  </span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#707065]">
                  {order.status}
                </span>
                <span className="text-[#4a4a40]">{formatINR(order.total)}</span>
                <span className="text-[#4a4a40]">{order._count.items}</span>
                <span className="text-[#707065]">
                  {format(new Date(order.createdAt), "d MMM yyyy")}
                </span>
              </Link>
            ))}
          </div>

          <OrdersPagination
            page={filters.page}
            totalPages={totalPages}
            onPageChange={(page) => void setFilters({ page })}
          />
        </div>
      )}
    </div>
  );
}
