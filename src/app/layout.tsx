import type { Metadata } from "next";
import { Shantell_Sans, Fredoka, Hanken_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import "./globals.css";

const shantell = Shantell_Sans({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-shantell",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fredoka",
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
        className={`${shantell.variable} ${fredoka.variable} ${hanken.variable}`}
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
