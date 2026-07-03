"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2, Smartphone, Ticket } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/states";
import { useMyCoupons, useMyProfile, type CouponRow } from "@/lib/queries";

/** Render kartu kupon jadi PNG (canvas) lalu unduh. */
function downloadCoupon(c: CouponRow) {
  const W = 900;
  const H = 420;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return void toast.error("Browser tidak mendukung unduhan.");

  // Latar teal + panel putih
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0e7490");
  bg.addColorStop(1, "#0891b2");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(40, 40, W - 80, H - 80, 24);
  ctx.fill();

  // Garis putus pemisah ala tiket
  ctx.strokeStyle = "#cbd5e1";
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(W - 280, 60);
  ctx.lineTo(W - 280, H - 60);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#0e7490";
  ctx.font = "bold 30px Arial";
  ctx.fillText("YOUTH CHARACTER SUMMIT", 80, 110);
  ctx.fillStyle = "#f97316";
  ctx.font = "bold 22px Arial";
  ctx.fillText("KUPON UNDIAN HANDPHONE", 80, 148);

  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 44px Courier New";
  ctx.fillText(c.code, 80, 230);

  ctx.fillStyle = "#475569";
  ctx.font = "18px Arial";
  ctx.fillText("Atas nama : " + (c.owner_name ?? "-"), 80, 280);
  ctx.fillText(
    "Terbit    : " + new Date(c.created_at).toLocaleDateString("id-ID"),
    80,
    308,
  );
  ctx.fillText("Simpan kupon ini. Pemenang diumumkan panitia.", 80, 336);

  // Panel kanan
  ctx.fillStyle = "#0e7490";
  ctx.font = "bold 20px Arial";
  ctx.fillText("HADIAH", W - 240, 150);
  ctx.font = "bold 34px Arial";
  ctx.fillText("HP", W - 240, 200);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#475569";
  ctx.fillText("diundi di akhir", W - 240, 240);
  ctx.fillText("event", W - 240, 262);

  const a = document.createElement("a");
  a.download = `kupon-${c.code}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

export default function CouponPage() {
  const router = useRouter();
  const { data: me, isLoading: loadingMe } = useMyProfile();
  const enabled = !!me && me.role === "voter" && me.onboarded;
  const { data: coupons, isLoading } = useMyCoupons(enabled);

  React.useEffect(() => {
    if (!loadingMe && !me) router.replace("/login?next=/kupon");
  }, [loadingMe, me, router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container max-w-xl space-y-6 py-8">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Ticket className="h-6 w-6 text-accent" />
            Kupon Undian
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Hadiah handphone, diundi di akhir event. Kupon didapat dari follow
            akun Universitas STEKOM saat vote pertamamu.
          </p>
        </div>

        {loadingMe || isLoading ? (
          <LoadingState />
        ) : !coupons || coupons.length === 0 ? (
          <EmptyState
            title="Belum ada kupon"
            description="Vote peserta favoritmu dan follow akun STEKOM untuk mendapatkan kupon."
          />
        ) : (
          <div className="space-y-3">
            {coupons.map((c) => (
              <Card
                key={c.code}
                className="overflow-hidden border-primary/25"
              >
                <div className="flex items-stretch">
                  {/* Kiri: identitas kupon */}
                  <CardContent className="flex-1 space-y-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-accent">
                      Kupon Undian Handphone
                    </p>
                    <p className="font-mono text-2xl font-extrabold tracking-wide">
                      {c.code}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {c.owner_name} ·{" "}
                      {new Date(c.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </CardContent>
                  {/* Kanan: aksi, dipisah garis putus ala tiket */}
                  <div className="flex w-28 flex-col items-center justify-center gap-2 border-l border-dashed bg-muted/30 p-3">
                    <Smartphone className="h-6 w-6 text-primary" />
                    <Button size="sm" onClick={() => downloadCoupon(c)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            <p className="text-center text-xs text-muted-foreground">
              Unduh dan simpan kuponmu. Pengundian dilakukan panitia di akhir
              event.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
