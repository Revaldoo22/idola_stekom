"use client";

import { useAdminStats } from "../hooks";
import type { AdminStats } from "../api";

const CARDS: { key: keyof AdminStats; label: string }[] = [
  { key: "totalSchools", label: "Sekolah" },
  { key: "totalParticipants", label: "Peserta" },
  { key: "totalVoters", label: "Voter" },
  { key: "totalVotes", label: "Total Vote" },
  { key: "totalPoints", label: "Total Poin" },
];

export function StatsCards() {
  const { data, isLoading, error } = useAdminStats();

  if (isLoading) return <p>Memuat statistik…</p>;
  if (error)
    return (
      <p style={{ color: "#f87171" }}>
        {error instanceof Error ? error.message : "Gagal memuat"}
      </p>
    );
  if (!data) return null;

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16,
      }}
    >
      {CARDS.map((c) => (
        <div key={c.key} style={card}>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>{c.label}</span>
          <strong style={{ fontSize: 28 }}>
            {data[c.key].toLocaleString("id-ID")}
          </strong>
        </div>
      ))}
    </section>
  );
}

const card: React.CSSProperties = {
  background: "#1e293b",
  borderRadius: 12,
  padding: 20,
  display: "grid",
  gap: 8,
};
