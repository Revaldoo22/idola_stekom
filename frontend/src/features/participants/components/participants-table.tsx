"use client";

import { useState } from "react";
import {
  useCreateParticipant,
  useDeleteParticipant,
  useParticipants,
  useUpdateParticipant,
} from "../hooks";
import type { Participant } from "../api";
import { ParticipantForm } from "./participant-form";

export function ParticipantsTable() {
  const { data, isLoading, error } = useParticipants();
  const createMut = useCreateParticipant();
  const updateMut = useUpdateParticipant();
  const deleteMut = useDeleteParticipant();

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Participant | null>(null);

  if (isLoading) return <p>Memuat peserta…</p>;
  if (error)
    return (
      <p style={{ color: "#f87171" }}>
        {error instanceof Error ? error.message : "Gagal memuat"}
      </p>
    );

  async function onDelete(p: Participant) {
    if (!window.confirm(`Hapus peserta "${p.name}"?`)) return;
    await deleteMut.mutateAsync(p.id);
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <button onClick={() => setAdding(true)} style={btnPrimary}>
          + Tambah Peserta
        </button>
      </div>

      <div style={{ overflowX: "auto", background: "#1e293b", borderRadius: 12 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr>
              {["#", "Nama", "Sekolah", "WA", "Poin", "Status", ""].map((h) => (
                <th key={h} style={th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((p, i) => (
              <tr key={p.id} style={{ borderTop: "1px solid #334155" }}>
                <td style={td}>{i + 1}</td>
                <td style={{ ...td, fontWeight: 600 }}>{p.name}</td>
                <td style={td}>{p.schoolName ?? "—"}</td>
                <td style={td}>{p.phoneNumber ?? "—"}</td>
                <td style={td}>{p.totalPoints.toLocaleString("id-ID")}</td>
                <td style={td}>
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      background: p.status === "active" ? "#14532d" : "#450a0a",
                      color: p.status === "active" ? "#86efac" : "#fca5a5",
                    }}
                  >
                    {p.status}
                  </span>
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  <button onClick={() => setEditing(p)} style={btnSmall}>
                    Edit
                  </button>{" "}
                  <button
                    onClick={() => onDelete(p)}
                    style={{ ...btnSmall, color: "#f87171" }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...td, textAlign: "center", color: "#64748b" }}>
                  Belum ada peserta.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {adding && (
        <ParticipantForm
          onSubmit={(payload) => createMut.mutateAsync(payload)}
          onClose={() => setAdding(false)}
        />
      )}
      {editing && (
        <ParticipantForm
          initial={editing}
          onSubmit={(payload) =>
            updateMut.mutateAsync({ id: editing.id, ...payload })
          }
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

const th: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 16px",
  color: "#94a3b8",
  fontSize: 12,
  textTransform: "uppercase",
};
const td: React.CSSProperties = { padding: "12px 16px" };
const btnPrimary: React.CSSProperties = {
  padding: "9px 16px",
  borderRadius: 8,
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};
const btnSmall: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 6,
  border: "1px solid #334155",
  background: "transparent",
  color: "#e2e8f0",
  cursor: "pointer",
  fontSize: 13,
};
