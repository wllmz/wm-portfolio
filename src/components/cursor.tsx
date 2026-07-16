"use client";

import { useEffect, useRef } from "react";

/**
 * Halo lumineux qui suit la souris (desktop uniquement).
 * Le curseur système reste visible : le halo est un accent, pas un remplacement.
 */
export function Cursor() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!finePointer || prefersReduced) return;

    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = -400;
    let mouseY = -400;
    let x = -400;
    let y = -400;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const tick = () => {
      x += (mouseX - x) * 0.12;
      y += (mouseY - y) * 0.12;
      glow.style.transform = `translate3d(${x - 200}px, ${y - 200}px, 0)`;
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[70] hidden size-[400px] rounded-full opacity-[0.13] mix-blend-screen [background:radial-gradient(circle,var(--color-electric)_0%,transparent_60%)] md:block"
    />
  );
}
