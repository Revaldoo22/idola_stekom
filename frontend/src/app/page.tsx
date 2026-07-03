import Link from "next/link";
import { GraduationCap, Trophy, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { ParticipantGrid } from "@/components/participant-grid";
import { PrizeButtons } from "@/components/prize-buttons";
import { MaintenanceOverlay } from "@/components/maintenance-overlay";
import { EventClosedOverlay } from "@/components/event-closed-overlay";
import { VoterTodayPanel } from "@/components/voter-today";
import { RoundCountdown } from "@/components/round-countdown";
import { HowItWorks, StatsStrip } from "@/components/home-sections";

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

      {/* Hero — satu pesan: dukung peserta sekarang */}
      <section className="relative overflow-hidden border-b">
        <div className="container space-y-5 py-14 text-center md:py-20">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <GraduationCap className="h-4 w-4" />
              Universitas STEKOM
            </span>
            <RoundCountdown />
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl">
            Youth Character <span className="text-accent">Summit</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Vote tiap hari &amp; kerjakan quest — bantu pelajar favoritmu dan
            sekolahnya lolos menuju outing class{" "}
            <strong className="text-foreground">
              11 hari 8 malam di Bali
            </strong>
            .
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Button
              size="lg"
              className="h-12 rounded-full px-7 text-base shadow-lg shadow-primary/25"
              asChild
            >
              <a href="#peserta">
                <Vote className="h-5 w-5" /> Mulai Dukung Peserta
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full bg-background/60 px-7 text-base backdrop-blur"
              asChild
            >
              <Link href="/ranking">
                <Trophy className="h-5 w-5" /> Lihat Peringkat
              </Link>
            </Button>
          </div>
          <PrizeButtons />

          <div className="pt-3">
            <StatsStrip />
          </div>
        </div>
      </section>

      {/* Cara ikut — hanya tampil sebelum siap vote */}
      <HowItWorks />

      {/* Peserta */}
      <section id="peserta" className="container scroll-mt-20 py-8">
        <VoterTodayPanel />
        <div className="mb-6 mt-6">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Pilih &amp; Dukung Peserta
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Klik peserta untuk vote (+5 harian, +20 favorit) dan mengerjakan
            quest.
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
