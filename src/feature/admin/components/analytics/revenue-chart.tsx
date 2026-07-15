"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatINR } from "@/lib/format";
import {
  ChartPanel,
  formatDayLabel,
} from "@/feature/admin/components/analytics/chart-panel";

type Point = { date: string; revenue: number; orders: number };

export function RevenueChart({ data }: { data: Point[] }) {
  const hasData = data.some((d) => d.revenue > 0 || d.orders > 0);
  const chartData = data.map((d) => ({
    ...d,
    label: formatDayLabel(d.date),
  }));

  return (
    <ChartPanel
      title="Revenue & orders"
      description="Daily revenue from non-cancelled orders"
      empty={!hasData}
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e5e0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#707065", fontSize: 11 }}
            axisLine={{ stroke: "#e5e5e0" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="revenue"
            tick={{ fill: "#707065", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`
            }
          />
          <YAxis
            yAxisId="orders"
            orientation="right"
            tick={{ fill: "#707065", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 0,
              borderColor: "#e5e5e0",
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const n = typeof value === "number" ? value : Number(value);
              return name === "revenue" ? formatINR(n) : n;
            }}
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.date
                ? formatDayLabel(String(payload[0].payload.date))
                : ""
            }
          />
          <Area
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            name="revenue"
            stroke="#1a1a1a"
            fill="#f5f5f0"
            strokeWidth={2}
          />
          <Area
            yAxisId="orders"
            type="monotone"
            dataKey="orders"
            name="orders"
            stroke="#707065"
            fill="transparent"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
