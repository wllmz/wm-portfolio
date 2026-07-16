import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Shantell_Sans,
  Hanken_Grotesk,
} from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

// Bricolage Grotesque : logo (800) et titres (600/700) — découpes franches
// en écho aux arêtes du cube, registre atelier contemporain.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const shantell = Shantell_Sans({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-shantell",
  display: "swap",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  title: "wm — William Martinez, fullstack freelance",
  description:
    "Développeur full stack freelance. Un projet, six faces, zéro angle mort : design, front, mobile, api, data, deploy. Disponible pour vos projets web & mobile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${bricolage.variable} ${shantell.variable} ${hanken.variable}`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
