import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = "Festival Karakter Pelajar — Universitas STEKOM";
const description =
  "Platform kompetisi karakter pelajar SMA/SMK. Dukung peserta favoritmu dan menangkan smartphone, sertifikat, & jadi Duta Teladan STEKOM!";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "Festival Karakter Pelajar",
    "STEKOM",
    "kompetisi pelajar",
    "voting",
    "SMA SMK",
  ],
  openGraph: {
    title,
    description,
    siteName: "Festival Karakter Pelajar STEKOM",
    type: "website",
    locale: "id_ID",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={jakarta.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
