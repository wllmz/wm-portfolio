import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Shantell_Sans,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Instrument Sans, la famille du site : le contraste vient des tailles et
// des graisses (400 à 700).
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

// les titres de section (« 01 projets », « 02 à propos », « 03 contact »)
// gardent leur style d'origine : le mot en Bricolage, le numéro en Shantell
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-bricolage",
  display: "swap",
});

const shantell = Shantell_Sans({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-shantell",
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
    // les variables des polices vont sur <html> : le thème (`--font-title`,
    // `--font-hand`…) est déclaré sur :root et y résout `var(--font-…)` ;
    // posées sur <body>, elles n'existaient pas encore à ce niveau et tous
    // les titres retombaient sur la police par défaut
    <html
      lang="fr"
      className={`${instrument.variable} ${bricolage.variable} ${shantell.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
