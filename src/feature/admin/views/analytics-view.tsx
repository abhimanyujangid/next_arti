"use client";

import { trpc } from "@/lib/trpc/client";
import { AnalyticsRangeFilter, useAnalyticsRange } from "@/feature/admin/components/analytics/analytics-range-filter";
import { AnalyticsSkeleton } from "@/feature/admin/components/analytics/analytics-skeleton";
import { OrdersStatusChart } from "@/feature/admin/components/analytics/orders-status-chart";
import { RevenueChart } from "@/feature/admin/components/analytics/revenue-chart";
import { ReviewsChart } from "@/feature/admin/components/analytics/reviews-chart";
import { SignupsChart } from "@/feature/admin/components/analytics/signups-chart";
import { TopProductsChart } from "@/feature/admin/components/analytics/top-products-chart";

export function AnalyticsView() {
  const range = useAnalyticsRange();
  const { data, isLoading } = trpc.admin.analytics.overview.useQuery({ range });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-[#1a1a1a]">Analytics</h2>
          <p className="mt-2 text-sm tracking-wide text-[#707065]">
            Store performance from orders, customers, and reviews.
          </p>
        </div>
        <AnalyticsRangeFilter />
      </div>

      {isLoading || !data ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart data={data.revenueByDay} />
          <OrdersStatusChart data={data.ordersByStatus} />
          <SignupsChart data={data.signupsByDay} />
          <TopProductsChart data={data.topProducts} />
          <ReviewsChart data={data.reviewsByDay} />
        </div>
      )}
    </div>
  );
}
