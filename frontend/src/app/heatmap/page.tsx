"use client";

import * as React from "react";
import { Flame, MapPin, School as SchoolIcon, Users } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { MaintenanceOverlay } from "@/components/maintenance-overlay";
import { EventClosedOverlay } from "@/components/event-closed-overlay";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/states";
import { useActiveRound, useHeatmap } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

/** Skala panas relatif 0..1 → kelas warna latar. */
function heat(ratio: number): string {
  if (ratio >= 0.8) return "bg-primary text-primary-foreground";
  if (ratio >= 0.55) return "bg-primary/70 text-primary-foreground";
  if (ratio >= 0.35) return "bg-primary/45 text-primary-foreground";
  if (ratio >= 0.15) return "bg-primary/25";
  if (ratio > 0) return "bg-primary/10";
  return "bg-muted";
}

export default function HeatmapPage() {
  const { data: activeRound } = useActiveRound();
  const [scope, setScope] = React.useState<"round" | "all">("round");
  const roundId =
    scope === "round" && activeRound ? activeRound.id : undefined;
  const { data, isLoading } = useHeatmap(roundId);

  const rows = data ?? [];
  const max = Math.max(1, ...rows.map((r) => r.points));

  return (
    <div className="min-h-screen">
      <MaintenanceOverlay />
      <EventClosedOverlay />
      <Navbar
        links={[
          { href: "/ranking", label: "Ranking" },
          { href: "/heatmap", label: "Heatmap" },
          { href: "/top-voter", label: "Top Voter" },
        ]}
      />

      <main className="container space-y-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <Flame className="h-6 w-6 text-primary" />
              Heatmap Kabupaten
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Persaingan antar kabupaten — makin pekat, makin panas votingnya.
              {activeRound && scope === "round" && (
                <> Sedang berlangsung: <strong>{activeRound.name}</strong>.</>
              )}
            </p>
          </div>
          {activeRound && (
            <div className="flex rounded-lg border p-0.5 text-sm">
              <button
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1.5 transition-colors",
                  scope === "round"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setScope("round")}
              >
                {activeRound.name}
              </button>
              <button
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1.5 transition-colors",
                  scope === "all"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setScope("all")}
              >
                Sepanjang Event
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <LoadingState />
        ) : rows.length === 0 ? (
          <EmptyState
            title="Belum ada kabupaten"
            description="Panitia belum mengelompokkan sekolah ke kabupaten."
          />
        ) : (
          <>
            {/* Heat grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {rows.map((r, i) => {
                const ratio = r.points / max;
                return (
                  <Card
                    key={r.region_id}
                    className={cn(
                      "card-lift overflow-hidden border-border/60",
                      heat(ratio),
                    )}
                  >
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1.5 font-semibold">
                          <MapPin className="h-4 w-4 shrink-0 opacity-70" />
                          <span className="truncate">{r.region_name}</span>
                        </p>
                        <Badge
                          variant={i === 0 ? "accent" : "outline"}
                          className="shrink-0 bg-background/70 text-foreground"
                        >
                          #{i + 1}
                        </Badge>
                      </div>
                      <p className="text-2xl font-extrabold tabular-nums">
                        {formatNumber(r.points)}
                        <span className="ml-1 text-xs font-medium opacity-70">
                          poin
                        </span>
                      </p>
                      <div className="flex items-center gap-3 text-xs opacity-80">
                        <span className="flex items-center gap-1">
                          <SchoolIcon className="h-3.5 w-3.5" />
                          {r.schools} sekolah
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {formatNumber(r.votes)} vote
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Intensitas warna = poin vote relatif terhadap kabupaten teratas.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
