"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearToken, getToken } from "@/lib/api-client";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/participants", label: "Peserta" },
];

/** Wraps every admin page: token guard + top nav + logout. */
export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

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
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <h1 style={{ fontSize: 22 }}>{title}</h1>
          <nav style={{ display: "flex", gap: 14 }}>
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                style={{
                  fontSize: 14,
                  textDecoration: "none",
                  color: pathname === n.href ? "#60a5fa" : "#94a3b8",
                  fontWeight: pathname === n.href ? 600 : 400,
                }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
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
      {children}
    </main>
  );
}
