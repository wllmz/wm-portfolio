import type { Metadata } from "next";
import { Syne, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Cursor } from "@/components/cursor";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "William Martinez — Développeur Full Stack Freelance",
  description:
    "Je conçois et développe des produits web & mobile qui convertissent. Next.js, React Native, Node.js. Disponible pour vos projets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${syne.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}
      >
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
      </body>
    </html>
  );
}
