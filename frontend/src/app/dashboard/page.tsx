"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearToken, getToken } from "@/lib/api-client";
import { StatsCards } from "@/features/dashboard/components/stats-cards";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <h1 style={{ fontSize: 24 }}>Dashboard Admin</h1>
        <button
          onClick={logout}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#334155",
            color: "white",
            cursor: "pointer",
          }}
        >
          Keluar
        </button>
      </header>
      <StatsCards />
    </main>
  );
}
