"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { Trend } from "@/lib/types";

interface PriceChartProps {
  data: number[] | { fecha: string; valor: number }[];
  trend?: Trend;
  height?: number;
  showAxis?: boolean;
}

export default function PriceChart({
  data,
  trend = "flat",
  height = 56,
  showAxis = false,
}: PriceChartProps) {
  const points = Array.isArray(data)
    ? data.map((d, i) =>
        typeof d === "number" ? { index: i, valor: d } : { index: i, valor: d.valor, fecha: d.fecha }
      )
    : [];

  const color = trend === "up" ? "#34D399" : trend === "down" ? "#F87171" : "#8B5CF6";
  const gradientId = `chart-gradient-${trend}`;

  if (points.length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-xs text-violet-500"
      >
        Sin datos suficientes para graficar
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        {showAxis && (
          <>
            <XAxis dataKey="fecha" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                background: "#1B1333",
                border: "1px solid #4C1D95",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "#A78BFA" }}
            />
          </>
        )}
        <Area
          type="monotone"
          dataKey="valor"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
