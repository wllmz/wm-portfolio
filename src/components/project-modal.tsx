"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Project } from "@/data/projects";

/* durée de l'agrandissement depuis l'écran, et du retour */
const OPEN_MS = 520;
const CLOSE_MS = 380;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

type Props = {
  project: Project;
  /* l'écran cliqué : la popup en part et y retourne */
  origin: HTMLElement;
  onClosed: () => void;
};

/* le transform qui pose le panneau sur l'écran d'origine */
const fromOrigin = (panel: DOMRect, origin: DOMRect) =>
  `translate(${origin.left - panel.left}px, ${origin.top - panel.top}px) scale(${origin.width / panel.width}, ${origin.height / panel.height})`;

/** Le détail d'un projet en popup : elle s'agrandit depuis l'écran cliqué
    (scale in) et s'y rétracte à la fermeture (scale out). En haut, la
    capture en grand et ses vignettes ; dessous, le texte sur deux colonnes.
    Échap, le bouton ✕ ou un clic sur le fond la ferment. */
export function ProjectModal({ project, origin, onClosed }: Props) {
  const [i, setI] = useState(0);
  const closing = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const shots = project.shots;
  const n = shots.length;
  const shot = shots[i];
  const isPhone = !!shot && shot.h > shot.w;

  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  const reduce = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* scale in : le panneau part du rectangle de l'écran */
  useLayoutEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop || reduce()) return;
    const from = fromOrigin(
      panel.getBoundingClientRect(),
      origin.getBoundingClientRect(),
    );
    panel.animate(
      [
        { transform: from, borderRadius: "14px" },
        { transform: "none", borderRadius: "20px" },
      ],
      { duration: OPEN_MS, easing: EASE },
    );
    panel
      .querySelector(".pm-body")
      ?.animate(
        [{ opacity: 0 }, { opacity: 0, offset: 0.45 }, { opacity: 1 }],
        {
          duration: OPEN_MS,
        },
      );
    backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: OPEN_MS * 0.7,
    });
  }, [origin]);

  /* scale out : retour vers l'écran, puis la popup disparaît */
  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop || reduce()) {
      onClosed();
      return;
    }
    const to = fromOrigin(
      panel.getBoundingClientRect(),
      origin.getBoundingClientRect(),
    );
    panel.querySelector(".pm-body")?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CLOSE_MS * 0.4,
      fill: "forwards",
    });
    backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: CLOSE_MS,
      fill: "forwards",
    });
    panel
      .animate(
        [
          { transform: "none", borderRadius: "20px" },
          { transform: to, borderRadius: "14px" },
        ],
        {
          duration: CLOSE_MS,
          easing: "cubic-bezier(0.55, 0, 0.45, 1)",
          fill: "forwards",
        },
      )
      .finished.then(onClosed, onClosed);
  }, [origin, onClosed]);
  /* le clavier lit toujours la dernière version, sans réabonner l'effet */
  const latestClose = useRef(close);
  useLayoutEffect(() => {
    latestClose.current = close;
  }, [close]);

  useEffect(() => {
    /* le focus entre dans la popup, y reste, et revient sur l'écran */
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") latestClose.current();
      else if (e.key === "ArrowRight" && n > 1) go(1);
      else if (e.key === "ArrowLeft" && n > 1) go(-1);
      else if (e.key === "Tab") {
        const focusables = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>("button") ?? [],
        ).filter((el) => el.getClientRects().length > 0);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      origin.focus({ preventScroll: true });
    };
  }, [go, n, origin]);

  /* le défilement ne sort jamais de la popup : une molette ou un glissé
     qui ne fait pas défiler son texte est bloqué, au lieu de passer au
     site dessous (overflow: hidden sur la page ne suffit pas partout) */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    /* le bloc qui défile sous le pointeur : le texte (desktop) ou toute la
       popup (mobile) */
    const scrollerOf = (target: EventTarget | null) => {
      let el = target instanceof Element ? target : null;
      while (el && el !== root) {
        if (
          el instanceof HTMLElement &&
          el.scrollHeight > el.clientHeight + 1 &&
          /auto|scroll/.test(getComputedStyle(el).overflowY)
        )
          return el;
        el = el.parentElement;
      }
      return null;
    };
    const onWheel = (e: WheelEvent) => {
      /* sur les vignettes, la molette les fait défiler de côté */
      const thumbs = thumbsRef.current;
      if (
        thumbs &&
        e.target instanceof Node &&
        thumbs.contains(e.target) &&
        thumbs.scrollWidth > thumbs.clientWidth &&
        Math.abs(e.deltaY) > Math.abs(e.deltaX)
      ) {
        e.preventDefault();
        thumbs.scrollLeft += e.deltaY;
        return;
      }
      const el = scrollerOf(e.target);
      const atTop = !el || el.scrollTop <= 0;
      const atEnd =
        !el || el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atEnd))
        e.preventDefault();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!scrollerOf(e.target)) e.preventDefault();
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  /* la vignette affichée revient au centre de la rangée */
  useEffect(() => {
    const thumbs = thumbsRef.current;
    const active = thumbs?.children[i];
    if (!thumbs || !(active instanceof HTMLElement)) return;
    thumbs.scrollTo({
      left: active.offsetLeft - (thumbs.clientWidth - active.offsetWidth) / 2,
      behavior: reduce() ? "auto" : "smooth",
    });
  }, [i]);

  /* glisser la capture, au doigt comme à la souris, change d'écran */
  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || (e.target as Element).closest("button")) return;
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (n > 1 && Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      ref={rootRef}
      className="pm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pm-title"
    >
      <div ref={backdropRef} className="pm-backdrop" onClick={close} />

      <div ref={panelRef} className="pm-panel">
        <button
          ref={closeRef}
          type="button"
          className="pm-close"
          aria-label="Fermer"
          onClick={close}
        >
          ✕
        </button>

        <div className="pm-body">
          {shot && (
            <div className="pm-hero">
              <div
                className={n > 1 ? "pm-stage is-swipeable" : "pm-stage"}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (startX.current = null)}
              >
                <div
                  key={shot.src}
                  className={isPhone ? "pm-shot is-phone" : "pm-shot"}
                  style={{ "--ratio": shot.w / shot.h } as React.CSSProperties}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    loading="eager"
                    draggable={false}
                    sizes="(max-width: 820px) 92vw, 1000px"
                  />
                </div>
                {n > 1 && (
                  <>
                    <button
                      type="button"
                      className="pm-arrow is-prev"
                      aria-label="Écran précédent"
                      onClick={() => go(-1)}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="pm-arrow is-next"
                      aria-label="Écran suivant"
                      onClick={() => go(1)}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div className="pm-strip">
                <p className="pm-caption">
                  {n > 1 && (
                    <span className="pm-counter">
                      {i + 1} / {n}
                    </span>
                  )}
                  {shot.caption}
                </p>
                {n > 1 && (
                  <div ref={thumbsRef} className="pm-thumbs">
                    {shots.map((s, idx) => (
                      <button
                        type="button"
                        key={s.src}
                        className={
                          /* chaque vignette a la forme de sa capture : un
                             projet peut mêler écrans larges et pages hautes */
                          (s.h > s.w ? "pm-thumb is-phone" : "pm-thumb") +
                          (idx === i ? " on" : "")
                        }
                        aria-label={`Écran ${idx + 1} sur ${n}`}
                        aria-current={idx === i}
                        onClick={() => setI(idx)}
                      >
                        <Image src={s.src} alt="" fill sizes="104px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pm-text">
            <div>
              <p className="pm-num" aria-hidden="true">
                {project.num}
              </p>
              <h2 id="pm-title" className="pm-title">
                {project.title}
              </h2>
              <p className="pm-meta">
                {project.kind} · {project.status}
              </p>
              <p className="pm-tagline">{project.tagline}</p>

              <p className="pm-label">Le contexte</p>
              <p>{project.contexte}</p>

              <p className="pm-label">Côté technique</p>
              <div className="pm-chips">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>

            <div>
              <p className="pm-label is-first">Ce que j&apos;ai livré</p>
              <ul className="pm-list">
                {project.livre.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
