"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMyProfile, useVoterToday } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

/** Ringkasan aktivitas hari ini untuk voter login: vote masuk + kuota fav20. */
export function VoterTodayPanel() {
  const { data: me } = useMyProfile();
  const enabled = !!me && me.role === "voter" && me.onboarded;
  const { data } = useVoterToday(enabled);

  if (!enabled || !data) return null;

  const daily = data.votes.filter((v) => v.vote_kind === "daily5");
  const fav = data.votes.filter((v) => v.vote_kind === "fav20");

  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold">
            Aktivitas vote-mu hari ini
          </p>
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className="gap-1">
              <Heart className="h-3 w-3" /> {daily.length} harian
            </Badge>
            <Badge variant="accent" className="gap-1">
              <Star className="h-3 w-3" /> Favorit {data.fav_quota.used}/
              {data.fav_quota.max}
            </Badge>
          </div>
        </div>

        {data.votes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Belum ada vote hari ini — dukung pesertamu di bawah!
          </p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {data.votes.map((v, i) => (
              <li key={i}>
                <Link
                  href={`/peserta/${v.participant_id}`}
                  className="inline-flex items-center gap-1 rounded-full border bg-background px-2.5 py-1 text-xs font-medium transition-colors hover:bg-muted"
                >
                  {v.vote_kind === "fav20" ? (
                    <Star className="h-3 w-3 text-accent" />
                  ) : (
                    <Heart className="h-3 w-3 text-primary" />
                  )}
                  {v.participant_name}
                  <span className="text-muted-foreground">
                    +{formatNumber(v.points)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
