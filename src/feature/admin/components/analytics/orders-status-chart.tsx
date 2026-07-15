"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ChartPanel } from "@/feature/admin/components/analytics/chart-panel";

const COLORS = ["#1a1a1a", "#4a4a40", "#707065", "#a3a39a", "#c4c4bc", "#d4af37"];

type Point = { status: string; count: number };

export function OrdersStatusChart({ data }: { data: Point[] }) {
  const hasData = data.some((d) => d.count > 0);
  const chartData = data.map((d) => ({
    ...d,
    name: d.status,
  }));

  return (
    <ChartPanel
      title="Orders by status"
      description="Distribution across order lifecycle"
      empty={!hasData}
    >
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={96}
            paddingAngle={2}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 0,
              borderColor: "#e5e5e0",
              fontSize: 12,
              textTransform: "capitalize",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
