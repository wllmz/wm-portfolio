"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Magnetic } from "@/components/magnetic";

/** Ligne de titre révélée derrière un masque, façon rideau. */
function MaskedLine({
  children,
  delay,
  className = "",
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <span className="block overflow-hidden">
      <motion.span
        className={`block ${className}`}
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-svh flex-col justify-between overflow-hidden pt-24">
      <div className="mx-auto w-full max-w-6xl grow px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-10 font-mono text-xs tracking-[0.3em] text-mute uppercase"
        >
          William Martinez — basé sur le web, disponible partout
        </motion.p>

        <h1 className="mt-8 font-display text-[clamp(3.4rem,12.5vw,10.5rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
          <MaskedLine delay={0.15}>Développeur</MaskedLine>
          <MaskedLine delay={0.28} className="text-outline">
            Full stack
          </MaskedLine>
          <MaskedLine delay={0.41}>
            Freelance<span className="text-accent">.</span>
          </MaskedLine>
        </h1>

        <div className="mt-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md text-lg leading-relaxed text-mute"
          >
            Je transforme vos idées en produits web & mobile qui convertissent
            — de la conception à la mise en production.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#contact"
                className="group inline-block rounded-full bg-ink px-7 py-3.5 font-medium text-paper transition-shadow duration-300 hover:shadow-[0_12px_32px_-12px_rgba(17,17,19,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Discutons de votre projet
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#projets"
                className="inline-block rounded-full border border-line px-7 py-3.5 text-ink transition-colors duration-300 hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Voir mes projets
              </a>
            </Magnetic>
          </motion.div>
        </div>
      </div>

      {/* Barre de pied de hero — détail éditorial */}
      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="mx-auto mt-16 w-full max-w-6xl px-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-5 font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
          <span>© 2026</span>
          <span className="hidden sm:inline">Next.js ✦ React Native ✦ Node.js</span>
          <span aria-hidden>Scroll ↓</span>
        </div>
      </motion.div>
    </section>
  );
}
