"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../api";
import { setToken } from "@/lib/api-client";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setId] = useState("");
  const [password, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(identifier, password);
      if (res.user.role !== "admin") {
        setError("Akun ini bukan admin.");
        return;
      }
      setToken(res.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        width: 340,
        background: "#1e293b",
        padding: 28,
        borderRadius: 12,
        display: "grid",
        gap: 14,
      }}
    >
      <h1 style={{ fontSize: 20 }}>Login Admin</h1>
      <input
        placeholder="Nama atau nomor WhatsApp"
        value={identifier}
        onChange={(e) => setId(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPw(e.target.value)}
        style={inputStyle}
      />
      {error && <p style={{ color: "#f87171", fontSize: 13 }}>{error}</p>}
      <button type="submit" disabled={loading} style={btnStyle}>
        {loading ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#e2e8f0",
};
const btnStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "none",
  background: "#3b82f6",
  color: "white",
  fontWeight: 600,
  cursor: "pointer",
};
