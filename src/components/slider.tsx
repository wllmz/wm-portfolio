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
const OWN_GESTURE = ".scene, .proj-modal, .face-card";

/* Zones qui défilent à l'intérieur de leur écran. Elles ne confisquent pas le
   geste : elles le gardent tant qu'il leur reste de la course, et le rendent
   au slider une fois en butée — sinon on reste prisonnier de l'écran. */
const SCROLLER = ".about-grid, #contact, .xp-reveal, .xpanels";

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

/** Le conteneur sous le doigt (ou le curseur) peut-il encore défiler dans ce
    sens ? `dy > 0` = on descend, donc vers l'écran suivant. */
function stillScrolls(target: EventTarget | null, dy: number) {
  /* on remonte toute la chaîne : selon la taille d'écran, c'est le texte
     révélé OU la pile de cartes qui porte le défilement */
  let el = (target as HTMLElement | null)?.closest?.<HTMLElement>(SCROLLER);
  while (el) {
    /* un contenu plus haut que son cadre ne défile pas pour autant : sur
       grand écran ces mêmes blocs sont en overflow visible */
    const oy = getComputedStyle(el).overflowY;
    if (oy === "auto" || oy === "scroll") {
      const room = el.scrollHeight - el.clientHeight;
      if (room > 2 && (dy > 0 ? el.scrollTop < room - 1 : el.scrollTop > 1))
        return true;
    }
    el = el.parentElement?.closest<HTMLElement>(SCROLLER) ?? null;
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
      window.setTimeout(() => (animating.current = false), 950);
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
      if (animating.current || modalOpen()) return;
      if (stillScrolls(e.target, e.deltaY)) return;
      if (e.deltaY > 24) go(idxRef.current + 1);
      else if (e.deltaY < -24) go(idxRef.current - 1);
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
      /* la cible d'un touchend reste celle du touchstart : on interroge donc
         bien le conteneur d'où le geste est parti */
      if (stillScrolls(e.target, dy)) return;
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
    </div>
  );
}
