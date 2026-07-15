"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatINR } from "@/lib/format";
import { ChartPanel } from "@/feature/admin/components/analytics/chart-panel";

type Point = { title: string; qty: number; revenue: number };

function truncateTitle(title: string, max = 28) {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

export function TopProductsChart({ data }: { data: Point[] }) {
  const hasData = data.length > 0;
  const chartData = data.map((d) => ({
    ...d,
    label: truncateTitle(d.title),
  }));

  return (
    <ChartPanel
      title="Top products"
      description="By revenue in selected period"
      empty={!hasData}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
        >
          <CartesianGrid stroke="#e5e5e0" strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: "#707065", fontSize: 11 }}
            axisLine={{ stroke: "#e5e5e0" }}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${v}`
            }
          />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fill: "#707065", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
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
              payload?.[0]?.payload?.title ?? ""
            }
          />
          <Bar dataKey="revenue" name="revenue" fill="#4a4a40" radius={0} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
