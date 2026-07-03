"use client";

import Link from "next/link";
import { ArrowDown, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMyProfile } from "@/lib/queries";

/**
 * CTA utama hero — satu tombol primer sesuai kondisi voter:
 *   belum login   → Masuk & mulai dukung
 *   belum wizard  → Lengkapi profil
 *   siap          → langsung ke daftar peserta
 */
export function HeroCta() {
  const { data: me, isLoading } = useMyProfile();

  const ready = !!me && me.role === "voter" && me.onboarded;
  const needsWizard = !!me && me.role === "voter" && !me.onboarded;

  if (isLoading) {
    return <div className="h-12" aria-hidden />;
  }

  if (!me) {
    return (
      <div className="space-y-2">
        <Button
          size="lg"
          className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/25"
          asChild
        >
          <Link href="/login">
            <LogIn className="h-5 w-5" /> Masuk &amp; Mulai Dukung
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          Gratis, cukup akun Google — sekali daftar langsung bisa vote.
        </p>
      </div>
    );
  }

  if (needsWizard) {
    return (
      <Button
        size="lg"
        className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/25"
        asChild
      >
        <Link href="/onboarding">
          <Sparkles className="h-5 w-5" /> Lengkapi Profil — 1 Menit
        </Link>
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      className="h-12 rounded-full px-8 text-base shadow-lg shadow-primary/25"
      asChild
    >
      <a href="#peserta">
        <ArrowDown className="h-5 w-5" /> Pilih Peserta &amp; Vote Sekarang
      </a>
    </Button>
  );
}
