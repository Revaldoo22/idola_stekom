"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/components/confirm-dialog";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={client}>
        <ConfirmProvider>{children}</ConfirmProvider>
        <Toaster
          position="top-center"
          duration={3500}
          gap={10}
          toastOptions={{
            // Kartu putih bersih + aksen tepi kiri berwarna per jenis —
            // serasi tema YCS (radius 2xl, shadow lembut, font ikut app).
            unstyled: true,
            classNames: {
              toast:
                "group pointer-events-auto flex w-[380px] max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 pl-3.5 font-sans text-sm text-foreground shadow-xl shadow-black/10 data-[type=success]:border-l-4 data-[type=success]:border-l-emerald-500 data-[type=error]:border-l-4 data-[type=error]:border-l-destructive data-[type=warning]:border-l-4 data-[type=warning]:border-l-amber-500 data-[type=info]:border-l-4 data-[type=info]:border-l-primary",
              icon: "shrink-0 [&>svg]:h-5 [&>svg]:w-5 group-data-[type=success]:text-emerald-500 group-data-[type=error]:text-destructive group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-primary",
              title: "font-semibold leading-snug",
              description: "text-xs text-muted-foreground",
              actionButton:
                "rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground",
              cancelButton:
                "rounded-lg bg-muted px-3 py-1.5 text-xs font-medium",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
