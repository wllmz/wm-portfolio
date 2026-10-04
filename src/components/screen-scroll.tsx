"use client";

import { useEffect } from "react";

/* hauteur de la barre du haut : chaque écran s'arrête juste dessous */
const TOP_BAR = 56;
/* le temps du glissé d'un écran à l'autre : les crans reçus pendant ce temps
   (l'inertie d'un pavé tactile) sont ignorés */
const LOCK_MS = 850;
/* cumul de défilement à partir duquel un geste compte comme un cran */
const THRESHOLD = 40;

/* les écrans, dans l'ordre : le hero, un par projet, l'à propos, le contact */
const SCREENS = ".hero, .ec-snap, #a-propos, #contact";

/** Sur desktop, la page d'accueil défile comme un slider : un cran de molette
    (ou un geste de pavé tactile) mène à l'écran suivant ou précédent. Le
    clavier et la barre de défilement restent libres, accrochés par le
    scroll-snap CSS. Rien sur mobile, ni dans un champ ou une fenêtre ouverte
    qui défile elle-même. */
export function ScreenScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 821px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let locked = false;
    let total = 0;
    let unlock = 0;

    /* le haut de chaque écran dans la page, plus le bas de la page (pied) */
    const stops = () => {
      const tops = Array.from(document.querySelectorAll<HTMLElement>(SCREENS)).map(
        (el) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - TOP_BAR),
      );
      tops.push(document.documentElement.scrollHeight - window.innerHeight);
      return [...new Set(tops.map(Math.round))].sort((a, b) => a - b);
    };

    const onWheel = (e: WheelEvent) => {
      if (!desktop.matches || e.ctrlKey) return;
      const target = e.target as Element | null;
      if (target?.closest("textarea, select, .face-card, .app-modal")) return;
      e.preventDefault();
      if (locked) return;
      total += e.deltaY;
      if (Math.abs(total) < THRESHOLD) return;

      const dir = Math.sign(total);
      total = 0;
      const y = window.scrollY;
      const list = stops();
      const next =
        dir > 0 ? list.find((top) => top > y + 2) : [...list].reverse().find((top) => top < y - 2);
      if (next === undefined) return;

      locked = true;
      window.scrollTo({ top: next, behavior: reduce.matches ? "instant" : "smooth" });
      unlock = window.setTimeout(() => {
        locked = false;
        total = 0;
      }, LOCK_MS);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(unlock);
    };
  }, []);

  return null;
}
