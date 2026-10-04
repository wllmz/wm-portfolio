"use client";

import { useEffect } from "react";

/* hauteur de la barre du haut : chaque écran s'arrête juste dessous */
const TOP_BAR = 56;
/* durée du glissé d'un écran à l'autre */
const DURATION = 750;
/* cumul de défilement à partir duquel un geste compte comme un cran */
const THRESHOLD = 40;
/* après un glissé, l'inertie d'un pavé tactile continue d'envoyer des crans :
   on les ignore tant qu'ils arrivent à moins de ce délai les uns des autres */
const QUIET_MS = 180;

/* les écrans, dans l'ordre : le hero, un par projet, l'à propos, le contact */
const SCREENS = ".hero, .ec-snap, #a-propos, #contact";

/* lent au départ et à l'arrivée */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Sur desktop, la page d'accueil défile comme un slider : un cran de molette,
    un geste de pavé tactile ou une touche (flèches, page, espace) mène à
    l'écran suivant ou précédent, dans un glissé à durée fixe. Rien sur
    mobile, ni dans un champ ou une fenêtre ouverte qui défile elle-même. */
export function ScreenScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 821px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const html = document.documentElement;
    let moving = false;
    /* après un glissé, on attend une pause avant d'accepter un nouveau geste */
    let settle = false;
    let total = 0;
    let lastWheel = 0;
    let frame = 0;

    /* le haut de chaque écran dans la page, plus le bas de la page (pied) */
    const stops = () => {
      const tops = Array.from(document.querySelectorAll<HTMLElement>(SCREENS)).map(
        (el) => Math.max(0, el.getBoundingClientRect().top + window.scrollY - TOP_BAR),
      );
      tops.push(html.scrollHeight - window.innerHeight);
      return [...new Set(tops.map(Math.round))].sort((a, b) => a - b);
    };

    const glide = (to: number) => {
      const from = window.scrollY;
      if (reduce.matches) {
        window.scrollTo(0, to);
        return;
      }
      moving = true;
      /* le défilement doux du CSS ralentirait chaque pas de l'animation */
      html.style.scrollBehavior = "auto";
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        window.scrollTo(0, from + (to - from) * ease(t));
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          moving = false;
          html.style.scrollBehavior = "";
        }
      };
      frame = requestAnimationFrame(step);
    };

    const go = (dir: number) => {
      const y = window.scrollY;
      const list = stops();
      const next =
        dir > 0 ? list.find((top) => top > y + 2) : [...list].reverse().find((top) => top < y - 2);
      if (next !== undefined) glide(next);
    };

    /* un champ, une liste ou une fenêtre ouverte gardent leur défilement */
    const free = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest("input, textarea, select, .face-card, .app-modal");

    const onWheel = (e: WheelEvent) => {
      if (!desktop.matches || e.ctrlKey || free(e.target)) return;
      e.preventDefault();
      const now = performance.now();
      const quiet = now - lastWheel > QUIET_MS;
      lastWheel = now;
      if (moving) return;
      if (settle && !quiet) return;
      settle = false;
      /* un nouveau geste repart de zéro */
      if (quiet) total = 0;
      total += e.deltaY;
      if (Math.abs(total) < THRESHOLD) return;
      const dir = Math.sign(total);
      total = 0;
      settle = true;
      go(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (!desktop.matches || e.altKey || e.ctrlKey || e.metaKey || free(e.target)) return;
      const down = ["ArrowDown", "PageDown"].includes(e.key) || (e.key === " " && !e.shiftKey);
      const up = ["ArrowUp", "PageUp"].includes(e.key) || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      /* l'espace et les flèches gardent leur rôle sur un bouton ou un lien */
      if (e.key === " " && e.target instanceof HTMLButtonElement) return;
      e.preventDefault();
      if (!moving) go(down ? 1 : -1);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frame);
      html.style.scrollBehavior = "";
    };
  }, []);

  return null;
}
