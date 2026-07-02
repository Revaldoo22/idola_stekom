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
import { useVoteSeries } from "../hooks";

export function VoteChart({ days = 14 }: { days?: number }) {
  const { data, isLoading, error } = useVoteSeries(days);

  if (isLoading) return <p>Memuat grafik…</p>;
  if (error || !data) return null;

  const series = data.map((d) => ({
    ...d,
    label: d.day.slice(5), // MM-DD
  }));

  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: 12,
        padding: 20,
        marginTop: 24,
      }}
    >
      <h2 style={{ fontSize: 15, marginBottom: 16, color: "#94a3b8" }}>
        Vote per hari ({days} hari terakhir)
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={series}>
          <defs>
            <linearGradient id="votes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
          <YAxis allowDecimals={false} stroke="#64748b" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
          />
          <Area
            type="monotone"
            dataKey="votes"
            stroke="#3b82f6"
            fill="url(#votes)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
