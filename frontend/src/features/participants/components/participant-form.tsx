"use client";

import { useState } from "react";
import { useSchools } from "../hooks";
import type { Participant, ParticipantPayload } from "../api";

interface Props {
  initial?: Participant;
  onSubmit: (payload: ParticipantPayload) => Promise<unknown>;
  onClose: () => void;
}

export function ParticipantForm({ initial, onSubmit, onClose }: Props) {
  const { data: schools } = useSchools();
  const [name, setName] = useState(initial?.name ?? "");
  const [schoolId, setSchoolId] = useState(initial?.schoolId ?? "");
  const [schoolName, setSchoolName] = useState("");
  const [phone, setPhone] = useState(initial?.phoneNumber ?? "");
  const [status, setStatus] = useState<"active" | "inactive">(
    initial?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Nama minimal 2 karakter");
    if (!initial && !schoolId && schoolName.trim().length < 2)
      return setError("Pilih atau ketik nama sekolah");

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        ...(schoolId ? { schoolId } : {}),
        ...(schoolName.trim() ? { schoolName: schoolName.trim() } : {}),
        ...(phone.trim() ? { phoneNumber: phone.trim() } : {}),
        ...(initial ? { status } : {}),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={overlay}>
      <form onSubmit={submit} style={panel}>
        <h2 style={{ fontSize: 18 }}>
          {initial ? "Edit Peserta" : "Tambah Peserta"}
        </h2>

        <label style={lbl}>Nama</label>
        <input value={name} onChange={(e) => setName(e.target.value)} style={inp} />

        <label style={lbl}>Sekolah (pilih)</label>
        <select
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          style={inp}
        >
          <option value="">— pilih sekolah —</option>
          {schools?.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label style={lbl}>…atau ketik sekolah baru</label>
        <input
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="Nama sekolah baru"
          style={inp}
          disabled={!!schoolId}
        />

        <label style={lbl}>No. WhatsApp (opsional)</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} style={inp} />

        {initial && (
          <>
            <label style={lbl}>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              style={inp}
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </>
        )}

        {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
          <button type="submit" disabled={saving} style={btnPrimary}>
            {saving ? "Menyimpan…" : "Simpan"}
          </button>
          <button type="button" onClick={onClose} style={btnGhost}>
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,.6)",
  display: "grid",
  placeItems: "center",
  zIndex: 50,
};
const panel: React.CSSProperties = {
  width: 380,
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#1e293b",
  padding: 24,
  borderRadius: 12,
  display: "grid",
  gap: 8,
};
const lbl: React.CSSProperties = { fontSize: 12, color: "#94a3b8", marginTop: 6 };
const inp: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#e2e8f0",
};
const btnPrimary: React.CSSProperties = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "transparent",
  color: "#e2e8f0",
  cursor: "pointer",
};
