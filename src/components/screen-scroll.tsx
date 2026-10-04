"use client";

import { useEffect } from "react";

/* hauteur de la barre du haut : chaque écran s'arrête juste dessous */
const TOP_BAR = 56;
/* durée du glissé d'un écran à l'autre */
const DURATION = 450;
/* cumul de défilement à partir duquel un geste compte comme un cran */
const THRESHOLD = 40;
/* après un glissé, l'inertie d'un pavé tactile continue d'envoyer des crans :
   on les ignore tant qu'ils arrivent à moins de ce délai les uns des autres */
const QUIET_MS = 180;
/* un écran plus haut que la fenêtre se lit en plusieurs pas : on garde ce
   recouvrement entre deux pas pour ne pas perdre le fil */
const OVERLAP = 40;

/* les écrans, dans l'ordre : le hero, un par projet, l'à propos, le contact */
const SCREENS = ".hero, .ec-snap, #a-propos, #contact";

/* lent au départ et à l'arrivée */
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** Sur desktop, la page d'accueil défile comme un slider : un cran de molette,
    un geste de pavé tactile ou une touche (flèches, page, espace) mène à
    l'écran suivant ou précédent, dans un glissé à durée fixe. Un écran plus
    haut que la fenêtre se lit en plusieurs pas. Rien sur mobile, avec le
    mouvement réduit, ni dans un champ ou une fenêtre qui défile elle-même. */
export function ScreenScroll() {
  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 1101px), (min-width: 821px) and (orientation: landscape)",
    );
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const html = document.documentElement;
    let moving = false;
    /* après un glissé, on attend une pause avant d'accepter un nouveau geste */
    let settle = false;
    let total = 0;
    let lastWheel = 0;
    let frame = 0;

    const active = () => desktop.matches && !reduce.matches;

    /* le haut de chaque écran dans la page, plus le bas de la page (pied) */
    const stops = () => {
      const tops = Array.from(
        document.querySelectorAll<HTMLElement>(SCREENS),
      ).map((el) =>
        Math.max(0, el.getBoundingClientRect().top + window.scrollY - TOP_BAR),
      );
      tops.push(html.scrollHeight - window.innerHeight);
      return [...new Set(tops.map(Math.round))].sort((a, b) => a - b);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      moving = false;
      html.style.scrollBehavior = "";
    };

    const glide = (to: number) => {
      const from = window.scrollY;
      moving = true;
      /* le défilement doux du CSS ralentirait chaque pas de l'animation */
      html.style.scrollBehavior = "auto";
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        window.scrollTo(0, from + (to - from) * ease(t));
        if (t < 1) frame = requestAnimationFrame(step);
        else stop();
      };
      frame = requestAnimationFrame(step);
    };

    /* l'écran suivant ou précédent. Un écran plus haut que la fenêtre se lit
       en plusieurs pas, sans sauter plus d'une hauteur : son bas reste
       atteignable */
    const go = (dir: number) => {
      const y = window.scrollY;
      const list = stops();
      const screen = window.innerHeight - TOP_BAR;
      const target =
        dir > 0
          ? list.find((top) => top > y + 2)
          : [...list].reverse().find((top) => top < y - 2);
      if (target === undefined) return;
      const next =
        Math.abs(target - y) <= screen + 2
          ? target
          : y + dir * (screen - OVERLAP);
      glide(next);
    };

    /* un champ, une liste ou une carte de face qui défile elle-même gardent
       leur défilement */
    const free = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      if (target.closest("input, textarea, select")) return true;
      const card = target.closest<HTMLElement>(".face-card");
      return !!card && card.scrollHeight > card.clientHeight;
    };

    const onWheel = (e: WheelEvent) => {
      if (!active() || e.ctrlKey || free(e.target)) return;
      /* un geste horizontal (Maj + molette, retour arrière au pavé) passe */
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      const now = performance.now();
      const quiet = now - lastWheel > QUIET_MS;
      lastWheel = now;
      if (moving) return;
      if (settle && !quiet) return;
      settle = false;
      /* un nouveau geste repart de zéro */
      if (quiet) total = 0;
      /* Firefox peut compter en lignes plutôt qu'en pixels */
      total += e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (Math.abs(total) < THRESHOLD) return;
      const dir = Math.sign(total);
      total = 0;
      settle = true;
      go(dir);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || !active()) return;
      if (e.altKey || e.ctrlKey || e.metaKey || free(e.target)) return;
      const space = e.key === " ";
      const down =
        ["ArrowDown", "PageDown"].includes(e.key) || (space && !e.shiftKey);
      const up = ["ArrowUp", "PageUp"].includes(e.key) || (space && e.shiftKey);
      if (!down && !up) {
        /* une autre touche (Tab vers un lien plus bas…) reprend la main */
        if (moving) stop();
        return;
      }
      /* l'espace garde son rôle sur un bouton ou un lien */
      if (
        space &&
        e.target instanceof Element &&
        e.target.closest("button, a")
      ) {
        return;
      }
      e.preventDefault();
      if (!moving) go(down ? 1 : -1);
    };

    /* un clic (barre de défilement, lien de la barre du haut) ou un focus
       qui fait défiler vers lui interrompent le glissé */
    const interrupt = () => {
      if (moving) stop();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", interrupt);
    window.addEventListener("focusin", interrupt);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("focusin", interrupt);
      stop();
    };
  }, []);

  return null;
}
