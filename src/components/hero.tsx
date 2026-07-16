"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// La scène 3D est chargée uniquement côté client, avec un fallback statique
// élégant pendant le chargement (et pour les GPU faibles).
const HeroScene = dynamic(() => import("@/components/scene/hero-scene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 [background:radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--color-ink)_6%,transparent),transparent_65%)]"
    />
  );
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Le hero est épinglé sur 160svh : pendant le scroll, l'orbe se
  // disloque doucement (voir hero-scene) et le texte s'efface.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.45], [0, -60]);

  return (
    <section ref={sectionRef} className="relative h-[160svh]">
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden">
        {/* Scène 3D en fond */}
        <div className="absolute inset-0" aria-hidden>
          <HeroScene />
        </div>

        {/* Voile de lisibilité en bas du hero */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-paper to-transparent"
        />

        <motion.div
          className="relative z-10 mx-auto w-full max-w-6xl px-6"
          style={reduce ? undefined : { opacity: textOpacity, y: textY }}
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="show"
        >
          <motion.p
            variants={item}
            className="mb-6 font-mono text-xs tracking-[0.3em] text-mute uppercase"
          >
            Développeur full stack — freelance
          </motion.p>

          <motion.h1
            variants={item}
            className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Je transforme vos idées en{" "}
            <span className="text-accent">produits web & mobile</span> qui
            convertissent.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-lg leading-relaxed text-mute"
          >
            William Martinez — je conçois, développe et livre des applications
            Next.js et React Native, de l&apos;idée à la mise en production.
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="group rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-all duration-300 hover:shadow-[0_12px_32px_-12px_rgba(17,17,19,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Discutons de votre projet
              <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#projets"
              className="rounded-full border border-line px-7 py-3.5 text-ink transition-colors duration-300 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Voir mes projets
            </a>
          </motion.div>
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          aria-hidden
          style={reduce ? undefined : { opacity: textOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-mute uppercase"
        >
          scroll
          <span className="mx-auto mt-2 block h-8 w-px animate-pulse bg-gradient-to-b from-ink to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
