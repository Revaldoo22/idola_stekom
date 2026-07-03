"use client";

import Link from "next/link";
import {
  Heart,
  LogIn,
  School as SchoolIcon,
  Trophy,
  Users,
  Vote,
} from "lucide-react";
import { useMyProfile, useParticipants } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

/** Statistik ringkas — derive dari query peserta (sudah di-cache utk grid). */
export function StatsStrip() {
  const { data } = useParticipants();
  if (!data || data.length === 0) return null;

  const active = data.filter((p) => p.status === "active");
  const schools = new Set(active.map((p) => p.schools?.id).filter(Boolean));
  const points = active.reduce((s, p) => s + p.total_points, 0);

  const items = [
    { icon: Users, value: active.length, label: "Peserta" },
    { icon: SchoolIcon, value: schools.size, label: "Sekolah" },
    { icon: Trophy, value: points, label: "Total Poin" },
  ];

  return (
    <div className="mx-auto flex max-w-xl items-center justify-center divide-x divide-border/60 rounded-2xl border border-border/60 bg-card/70 shadow-sm backdrop-blur">
      {items.map((it) => (
        <div key={it.label} className="flex-1 px-4 py-3 text-center">
          <p className="flex items-center justify-center gap-1.5 text-lg font-extrabold tabular-nums sm:text-2xl">
            <it.icon className="h-4 w-4 text-primary" />
            {formatNumber(it.value)}
          </p>
          <p className="text-xs text-muted-foreground">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  {
    icon: LogIn,
    title: "Masuk dengan Google",
    desc: "Sekali daftar, lengkapi profil singkat — gratis.",
  },
  {
    icon: Vote,
    title: "Dukung tiap hari",
    desc: "Vote harian +5 untuk semua peserta, favorit +20 untuk 10 pilihanmu.",
  },
  {
    icon: Heart,
    title: "Kerjakan quest",
    desc: "Poin tambahan untuk pesertamu — bawa sekolahmu lolos gelombang!",
  },
];

/** Panduan 3 langkah — hanya untuk pengunjung yang belum siap vote. */
export function HowItWorks() {
  const { data: me } = useMyProfile();
  const voterReady = !!me && me.role === "voter" && me.onboarded;
  if (voterReady) return null;

  return (
    <section className="container pb-2 pt-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="relative rounded-2xl border border-border/60 bg-card p-4"
          >
            <span className="absolute right-3 top-3 text-3xl font-extrabold text-primary/10">
              {i + 1}
            </span>
            <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="h-4 w-4" />
            </span>
            <p className="text-sm font-semibold">{s.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
      {!me && (
        <div className="mt-3 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <LogIn className="h-4 w-4" /> Mulai sekarang — masuk dengan Google
          </Link>
        </div>
      )}
    </section>
  );
}
