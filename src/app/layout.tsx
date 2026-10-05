import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Instrument Sans, seule famille du site : le contraste vient des tailles et
// des graisses (400 à 700), pas d'un mélange de polices.
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
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
    <html lang="fr" className={instrument.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
