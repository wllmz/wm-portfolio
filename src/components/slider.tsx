"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  Children,
  type ReactNode,
} from "react";

/* Zones qui gèrent leur propre geste : le slider doit les laisser tranquilles,
   sinon dragger le cube ou lire une étude de cas change d'écran. */
const OWN_GESTURE = ".scene, .proj-modal, .face-card, .about-grid";

/** Un modal est ouvert : il est portalisé dans body, hors de la piste. */
const modalOpen = () => !!document.querySelector(".proj-modal");

/** Slider vertical plein écran : chaque enfant devient un écran, on glisse
    de l'un à l'autre à la molette / aux flèches / au swipe. */
export function Slider({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const n = slides.length;
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const animating = useRef(false);

  const go = useCallback(
    (i: number) => {
      const t = Math.max(0, Math.min(n - 1, i));
      if (t === idxRef.current || animating.current) return;
      animating.current = true;
      idxRef.current = t;
      setIdx(t);
      window.setTimeout(() => (animating.current = false), 950);
    },
    [n],
  );

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (animating.current || modalOpen()) return;
      if (e.deltaY > 24) go(idxRef.current + 1);
      else if (e.deltaY < -24) go(idxRef.current - 1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (modalOpen()) return;
      if (["ArrowDown", "PageDown"].includes(e.key)) go(idxRef.current + 1);
      if (["ArrowUp", "PageUp"].includes(e.key)) go(idxRef.current - 1);
    };
    /* le geste tactile est verrouillé s'il démarre dans une zone qui gère
       elle-même le glissement — le cube en premier lieu */
    let ty = 0;
    let held = false;
    const onTS = (e: TouchEvent) => {
      held = !!(e.target as HTMLElement).closest(OWN_GESTURE);
      ty = e.touches[0].clientY;
    };
    const onTE = (e: TouchEvent) => {
      if (held || modalOpen()) return;
      const dy = ty - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) go(idxRef.current + (dy > 0 ? 1 : -1));
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTS, { passive: true });
    window.addEventListener("touchend", onTE, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTS);
      window.removeEventListener("touchend", onTE);
    };
  }, [go]);

  return (
    <div className="deck">
      <div
        className="track"
        style={{ transform: `translateY(-${idx * 100}svh)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className={`slide${i === idx ? " on" : ""}`}>
            {slide}
          </div>
        ))}
      </div>
      <nav className="slider-dots" aria-label="Navigation par écran">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === idx ? "on" : undefined}
            aria-label={`Écran ${i + 1}`}
            aria-current={i === idx}
            onClick={() => go(i)}
          />
        ))}
      </nav>
    </div>
  );
}
