"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartPanel,
  formatDayLabel,
} from "@/feature/admin/components/analytics/chart-panel";

type Point = { date: string; count: number };

export function ReviewsChart({ data }: { data: Point[] }) {
  const hasData = data.some((d) => d.count > 0);
  const chartData = data.map((d) => ({
    ...d,
    label: formatDayLabel(d.date),
  }));

  return (
    <ChartPanel
      title="Reviews submitted"
      description="Collector reviews per day"
      empty={!hasData}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e5e5e0" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#707065", fontSize: 11 }}
            axisLine={{ stroke: "#e5e5e0" }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
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
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload?.date
                ? formatDayLabel(String(payload[0].payload.date))
                : ""
            }
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Reviews"
            stroke="#1a1a1a"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "#1a1a1a" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}
