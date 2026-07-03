"use client";

import { Heart, Trophy, UserRoundPlus } from "lucide-react";
import { useMyProfile } from "@/lib/queries";

const STEPS = [
  {
    icon: UserRoundPlus,
    title: "Masuk & lengkapi profil",
    desc: "Login pakai akun Google, isi data sekali (sekolah, kelas, WA).",
  },
  {
    icon: Heart,
    title: "Vote tiap hari",
    desc: "+5 untuk tiap peserta per hari, +20 favorit untuk maks 10 peserta.",
  },
  {
    icon: Trophy,
    title: "Kerjakan quest, menangkan Bali",
    desc: "Poin quest bantu sekolahmu lolos gelombang menuju outing class Bali.",
  },
];

/** 3 langkah ikut — disembunyikan untuk voter yang sudah paham (onboarded). */
export function HowItWorks() {
  const { data: me } = useMyProfile();
  if (me && me.role === "voter" && me.onboarded) return null;

  return (
    <section className="container pb-4 pt-10">
      <h2 className="mb-6 text-center text-xl font-bold tracking-tight sm:text-2xl">
        Cara Ikut Mendukung
      </h2>
      <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <li
              key={s.title}
              className="relative rounded-2xl border border-border/60 bg-card p-5 pt-7 text-center shadow-sm"
            >
              <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground shadow-md">
                {i + 1}
              </span>
              <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
