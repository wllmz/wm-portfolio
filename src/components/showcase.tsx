"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Shot } from "@/components/cube/projects-data";

type Device = "phone" | "browser";

type TileIcon = { src: string; w: number; h: number; bg: string };

type Props = {
  title: string;
  subtitle: string;
  shots: Shot[];
  device: Device;
  /* logotype du projet ; sans lui la tuile retombe sur son pictogramme */
  icon?: TileIcon;
};

const CTA: Record<Device, string> = {
  phone: "Découvrir l'app",
  browser: "Voir les écrans",
};

export function Showcase({ title, subtitle, shots, device, icon }: Props) {
  const [open, setOpen] = useState(false);
  const [i, setI] = useState(0);
  const n = shots.length;
  const isPhone = device === "phone";

  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, go]);

  // swipe horizontal
  const startX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };

  const track = (
    <div
      className="sc-track"
      style={{ transform: `translateX(-${i * 100}%)` }}
    >
      {shots.map((s, idx) => (
        <div className="sc-slide" key={s.src}>
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes={isPhone ? "(max-width: 520px) 74vw, 300px" : "(max-width: 900px) 88vw, 820px"}
            priority={idx === 0}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section className="app-showcase" aria-label="Le projet en images">
      <button
        type="button"
        className="app-tile"
        onClick={() => {
          setI(0);
          setOpen(true);
        }}
      >
        <span
          className={icon ? "app-icon app-icon--logo" : `app-icon app-icon--${device}`}
          /* le pavé se resserre sur le logotype : dessiné pour un mot large,
             il laissait deux bandes vides autour d'un logo carré */
          style={
            icon
              ? {
                  background: icon.bg,
                  width: `min(104px, calc(44px * ${icon.w / icon.h} + 20px))`,
                }
              : undefined
          }
          aria-hidden="true"
        >
          {icon ? (
            <Image src={icon.src} alt="" width={icon.w} height={icon.h} />
          ) : isPhone ? (
            <svg viewBox="0 0 64 64" width="38" height="38">
              <circle cx="32" cy="33" r="17" fill="#3d9bff" />
              <ellipse cx="27" cy="31" rx="2.7" ry="3.6" fill="#0d1220" />
              <ellipse cx="37" cy="31" rx="2.7" ry="3.6" fill="#0d1220" />
            </svg>
          ) : (
            <svg viewBox="0 0 64 64" width="36" height="36">
              <rect x="11" y="15" width="42" height="34" rx="6" fill="#eae3d2" />
              <circle cx="17" cy="21" r="1.7" fill="#2d3660" />
              <circle cx="23" cy="21" r="1.7" fill="#2d3660" />
              <circle cx="29" cy="21" r="1.7" fill="#2d3660" />
              <rect x="11" y="26" width="42" height="23" rx="0" fill="#fbf8f2" />
            </svg>
          )}
        </span>
        <span className="app-tile-meta">
          <span className="app-tile-name">{title}</span>
          <span className="app-tile-sub">{subtitle}</span>
        </span>
        <span className="app-tile-cta">
          {CTA[device]}
          <span aria-hidden="true"> →</span>
        </span>
      </button>

      {open && (
        <div
          className="app-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Captures de ${title}`}
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            className="app-modal-close"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          <div className="app-stage" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="app-nav"
              aria-label="Écran précédent"
              onClick={() => go(-1)}
            >
              ‹
            </button>

            {isPhone ? (
              <div
                className="phone"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              >
                {track}
              </div>
            ) : (
              <div
                className="browser"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                /* le cadre épouse la capture affichée : un même projet peut
                   mêler pages hautes et écrans larges, et `cover` ne rogne
                   rien tant que le cadre a le ratio de l'image. La largeur
                   est bornée par la hauteur dispo pour qu'une page haute ne
                   déborde jamais de l'écran. */
                style={{
                  width: `min(var(--browser-max), calc(66vh * ${shots[i].w / shots[i].h}))`,
                }}
              >
                <div className="browser-bar" aria-hidden="true">
                  <span className="browser-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div
                  className="browser-view"
                  style={{ aspectRatio: `${shots[i].w} / ${shots[i].h}` }}
                >
                  {track}
                </div>
              </div>
            )}

            <button
              type="button"
              className="app-nav"
              aria-label="Écran suivant"
              onClick={() => go(1)}
            >
              ›
            </button>
          </div>

          <p className="app-caption" onClick={(e) => e.stopPropagation()}>
            {shots[i].caption}
          </p>

          <div className="app-dots" onClick={(e) => e.stopPropagation()}>
            {shots.map((s, idx) => (
              <button
                type="button"
                key={s.src}
                className={idx === i ? "on" : undefined}
                aria-label={`Écran ${idx + 1} sur ${n}`}
                aria-current={idx === i}
                onClick={() => setI(idx)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
