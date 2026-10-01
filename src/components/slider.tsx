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
   sinon dragger le cube change d'écran. */
const OWN_GESTURE = ".scene, .face-card";

/* Les touches de navigation servent d'abord au champ qui a le focus :
   déplacer le curseur dans le message ne doit pas changer d'écran. */
const EDITABLE =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

/** Une zone défilante entre la cible et le slide peut encore défiler dans
    ce sens : le geste lui revient, le slider ne bouge qu'en butée. */
function canScroll(target: EventTarget | null, dir: 1 | -1): boolean {
  let el = target instanceof Element ? target : null;
  while (el && !el.classList.contains("slide")) {
    const { overflowY } = getComputedStyle(el);
    if (
      (overflowY === "auto" || overflowY === "scroll") &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      if (dir === 1 && el.scrollTop + el.clientHeight < el.scrollHeight - 1)
        return true;
      if (dir === -1 && el.scrollTop > 1) return true;
    }
    el = el.parentElement;
  }
  return false;
}

/** Slider vertical plein écran : chaque enfant devient un écran, on glisse
    de l'un à l'autre à la molette / aux flèches / au swipe. */
export function Slider({
  children,
  labels = [],
}: {
  children: ReactNode;
  /** nom de chaque écran, pour les points de navigation */
  labels?: string[];
}) {
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
      /* le verrou couvre la durée du glissement ; sans animation (mouvement
         réduit), l'écran change d'un coup et le verrou se raccourcit */
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.setTimeout(() => (animating.current = false), reduce ? 300 : 950);
    },
    [n],
  );

  /* Une ancre (/#contact) ouvre directement l'écran qui la contient. Le
     navigateur ne peut plus faire défiler .deck lui-même (overflow: clip),
     c'est donc au slider de s'y rendre. Limite : un <Link href="/#x"> sur
     la même page passe par pushState sans déclencher hashchange — aucun
     lien de ce genre aujourd'hui, à gérer explicitement s'il en apparaît. */
  useEffect(() => {
    const toHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      const slide = target?.closest(".slide");
      if (!slide?.parentElement) return;
      const i = Array.from(slide.parentElement.children).indexOf(slide);
      if (i < 0) return;
      idxRef.current = i;
      setIdx(i);
    };
    toHash();
    window.addEventListener("hashchange", toHash);
    return () => window.removeEventListener("hashchange", toHash);
  }, []);

  useEffect(() => {
    /* Instant du dernier wheel absorbé par une zone défilante : l'inertie
       d'un trackpad continue d'envoyer des événements une fois la butée
       atteinte, ils ne doivent pas changer d'écran à la place du geste. */
    let lastInner = 0;
    const onWheel = (e: WheelEvent) => {
      // ctrl + molette, c'est le pinch-zoom du trackpad
      if (animating.current || e.ctrlKey) return;
      const dir = e.deltaY > 24 ? 1 : e.deltaY < -24 ? -1 : 0;
      if (!dir) return;
      if (canScroll(e.target, dir)) {
        lastInner = performance.now();
        return;
      }
      if (performance.now() - lastInner < 250) return;
      go(idxRef.current + dir);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target instanceof Element && e.target.closest(EDITABLE)) return;
      const dir = ["ArrowDown", "PageDown"].includes(e.key)
        ? 1
        : ["ArrowUp", "PageUp"].includes(e.key)
          ? -1
          : 0;
      if (dir && !canScroll(e.target, dir)) go(idxRef.current + dir);
    };
    /* Le geste tactile est verrouillé s'il démarre dans une zone qui gère
       elle-même le glissement (le cube), ou dans une zone qui pouvait encore
       défiler dans ce sens au début du geste. On lit cette capacité au
       touchstart : au touchend, le défilement du geste lui-même a déjà
       amené la zone en butée. */
    let ty = 0;
    let held = false;
    let scrollDown = false;
    let scrollUp = false;
    const onTS = (e: TouchEvent) => {
      held = e.target instanceof Element && !!e.target.closest(OWN_GESTURE);
      scrollDown = canScroll(e.target, 1);
      scrollUp = canScroll(e.target, -1);
      ty = e.touches[0].clientY;
    };
    const onTE = (e: TouchEvent) => {
      if (held) return;
      const dy = ty - e.changedTouches[0].clientY;
      if (dy > 40 && !scrollDown) go(idxRef.current + 1);
      else if (dy < -40 && !scrollUp) go(idxRef.current - 1);
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
    <main className="deck">
      <div
        className="track"
        style={{ transform: `translateY(-${idx * 100}svh)` }}
      >
        {slides.map((slide, i) => (
          /* inert : un écran hors champ ne reçoit ni focus ni clic, sinon
             Tab y emmène le navigateur, qui tente de le faire défiler */
          <div
            key={i}
            className={`slide${i === idx ? " on" : ""}`}
            inert={i !== idx}
          >
            {slide}
          </div>
        ))}
      </div>
      <nav className="slider-dots" aria-label="Navigation par écran">
        {slides.map((_, i) => (
          <button
            key={i}
            className={i === idx ? "on" : undefined}
            aria-label={labels[i] ?? `Écran ${i + 1}`}
            aria-current={i === idx}
            onClick={() => go(i)}
          />
        ))}
      </nav>
    </main>
  );
}
