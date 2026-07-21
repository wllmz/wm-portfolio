import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Shantell_Sans,
  Hanken_Grotesk,
} from "next/font/google";
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
  title: "wm · William Martinez, fullstack freelance",
  description:
    "Développeur full stack freelance. Un projet, six faces, zéro angle mort : design, front, back, tests & sécu, deploy, suivi. Disponible pour vos projets web & mobile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning : certaines extensions de navigateur injectent
    // des attributs sur <html>/<body> avant l'hydratation (ex.
    // data-scribe-recorder-ready, cz-shortcut-listen), ce qui déclenche un
    // faux mismatch. On l'ignore UNIQUEMENT sur ces deux balises.
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${bricolage.variable} ${shantell.variable} ${hanken.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
