"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { projects } from "@/data/projects";

/* hauteur de la barre du haut : la scène se colle juste dessous */
const TOP_BAR = 56;

type Pill = { src: string; wide: boolean };
const cover = (slug: string): Pill => ({
  src: projects.find((p) => p.slug === slug)?.shots[0]?.src ?? "/profile.jpg",
  wide: true,
});

/* le texte, mot par mot ; une pastille d'image se glisse après certains
   mots, la fin de la phrase centrale est écrite à la main */
const WORDS: { text: string; hand?: boolean; pill?: Pill }[] = [
  ..."Moi, c’est".split(" ").map((text) => ({ text })),
  { text: "William,", pill: { src: "/profile.jpg", wide: false } },
  ..."développeur full stack indépendant. Je conçois, je code,"
    .split(" ")
    .map((text) => ({ text })),
  { text: "je déploie", pill: cover("freia-paris") },
  ..."et j’assure le suivi une fois le projet en ligne. Je couvre tout le cycle d’un produit,"
    .split(" ")
    .map((text) => ({ text })),
  ..."seul, ou avec votre équipe.".split(" ").map((text) => ({ text, hand: true })),
  { text: "Comme chez Alcma", pill: cover("alcma") },
  ..."un ERP développé en binôme, avec un designer UX/UI."
    .split(" ")
    .map((text) => ({ text })),
];

const FACTS = [
  { k: "Statut", v: "Freelance" },
  { k: "Où", v: "Paris ou remote" },
  { k: "Réponse", v: "Sous 24 h" },
  { k: "Premier échange", v: "Gratuit" },
];

/** À propos, en manifeste : la scène reste collée sous la barre du haut et
    le défilement allume le texte mot par mot, du pâle au navy. Sans JS, ou
    avec le mouvement réduit, tout est allumé d'emblée. */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [lit, setLit] = useState(WORDS.length);

  /* avant le premier affichage, comme la scène des projets : la hauteur
     collée est prise tout de suite, la position restaurée ne saute pas */
  useLayoutEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPinned(true);
    }
  }, []);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      const run = section.offsetHeight - stage.offsetHeight;
      const scrolled = TOP_BAR - section.getBoundingClientRect().top;
      /* tout est allumé un peu avant la fin, le temps de lire la dernière
         ligne avant que la scène se décolle */
      const progress = Math.min(1, Math.max(0, scrolled / (run * 0.85)));
      setLit(Math.round(progress * WORDS.length));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);

  return (
    <section
      id="a-propos"
      ref={sectionRef}
      className={`mani${pinned ? " is-pinned" : ""}`}
      aria-labelledby="a-propos-titre"
    >
      <div className="mani-stage" ref={stageRef}>
        <header className="mani-head">
          <h2 id="a-propos-titre" className="mani-title">
            <span className="sec-num" aria-hidden="true">
              02
            </span>
            à propos
          </h2>
          <p className="mani-sub">la personne derrière les projets</p>
        </header>

        <p className="mani-text">
          {WORDS.map((word, i) => (
            <span
              key={i}
              className={`mani-word${i < lit ? " on" : ""}${word.hand ? " is-hand" : ""}`}
            >
              {word.text}
              {word.pill && (
                <span
                  className={`mani-pill${word.pill.wide ? " is-wide" : ""}`}
                  aria-hidden="true"
                >
                  <Image src={word.pill.src} alt="" fill sizes="120px" />
                </span>
              )}{" "}
            </span>
          ))}
        </p>

        <dl className="mani-facts">
          {FACTS.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
