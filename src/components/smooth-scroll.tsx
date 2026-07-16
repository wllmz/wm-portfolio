"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import Snap from "lenis/snap";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    /* effet slider : le scroll s'aimante sur le début des sections
       marquées data-snap (proximity : uniquement quand on en est
       proche — le contenu long reste librement scrollable) */
    const snap = new Snap(lenis, {
      type: "proximity",
      duration: 0.9,
    });
    snap.add(0); // le haut du hero
    document
      .querySelectorAll<HTMLElement>("[data-snap]")
      .forEach((el) => snap.addElement(el, { align: ["start"] }));

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      snap.destroy();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
