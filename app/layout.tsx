import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VernacTriage | Enterprise Linguistic Intelligence Platform",
  description: "Deterministic linguistic reconstruction of code-switched, phonetically spelled, and Latin-script vernacular into canonical orthography, standard English, and operational dispatch payloads.",
  icons: {
    icon: "/brand/vernactriage-mark.png",
    shortcut: "/brand/vernactriage-mark.png",
    apple: "/brand/vernactriage-mark.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5]">
        {children}
      </body>
    </html>
  );
}
