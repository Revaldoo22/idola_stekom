import Link from "next/link";
import { GraduationCap, Medal, Trophy } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { ParticipantGrid } from "@/components/participant-grid";
import { PrizeButtons } from "@/components/prize-buttons";
import { MaintenanceOverlay } from "@/components/maintenance-overlay";
import { EventClosedOverlay } from "@/components/event-closed-overlay";
import { VoterTodayPanel } from "@/components/voter-today";
import { RoundCountdown } from "@/components/round-countdown";
import { HeroCta } from "@/components/hero-cta";
import { HowItWorks } from "@/components/how-it-works";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <MaintenanceOverlay />
      <EventClosedOverlay />
      <Navbar
        links={[
          { href: "/ranking", label: "Ranking" },
          { href: "/peringkat-sekolah", label: "Peringkat Sekolah" },
          { href: "/heatmap", label: "Heatmap" },
          { href: "/gelombang", label: "Gelombang" },
          { href: "/top-voter", label: "Top Voter" },
        ]}
      />

      {/* Hero — satu pesan, satu aksi utama */}
      <section className="relative overflow-hidden border-b">
        <div className="container space-y-5 py-14 text-center md:py-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
            <GraduationCap className="h-4 w-4" />
            Universitas STEKOM
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
            Youth Character <span className="text-accent">Summit</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vote pelajar favoritmu tiap hari &amp; bantu sekolahmu lolos menuju
            outing class <strong>11 hari 8 malam di Bali</strong>.
          </p>

          <RoundCountdown />

          <div className="pt-1">
            <HeroCta />
          </div>

          {/* Aksi sekunder — sengaja kecil, tidak menyaingi CTA utama */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-1 text-sm">
            <Link
              href="/ranking"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Trophy className="h-4 w-4" /> Peringkat Sementara
            </Link>
            <Link
              href="/top-voter"
              className="inline-flex items-center gap-1.5 font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Medal className="h-4 w-4" /> Top Voter
            </Link>
          </div>
          <PrizeButtons />
        </div>
      </section>

      {/* 3 langkah — hilang otomatis setelah voter onboarded */}
      <HowItWorks />

      {/* Peserta */}
      <section id="peserta" className="container scroll-mt-20 py-10">
        <VoterTodayPanel />
        <div className="mb-6 mt-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Pilih &amp; Dukung Peserta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Vote harian <strong>+5</strong> untuk tiap peserta ·{" "}
            <strong>+20</strong> favorit untuk maks 10 peserta per hari ·
            quest untuk poin ekstra.
          </p>
        </div>
        <ParticipantGrid />
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Youth Character Summit — Universitas
        STEKOM.
      </footer>
    </div>
  );
}
