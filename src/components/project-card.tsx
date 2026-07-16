"use client";

import { useRef, type MouseEvent } from "react";

export type Project = {
  title: string;
  tag: string;
  problem: string;
  solution: string;
  result: string;
  stack: string[];
};

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  // Met à jour les variables CSS --x / --y pour le spotlight
  const onMouseMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      className="spotlight-card group rounded-2xl border border-line bg-surface p-8 transition-all duration-500 hover:-translate-y-1 hover:border-electric/50 hover:shadow-[0_20px_60px_-24px_color-mix(in_srgb,var(--color-electric)_45%,transparent)]"
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-bold">{project.title}</h3>
          <span className="shrink-0 rounded-full border border-neon/30 px-3 py-1 font-mono text-[10px] tracking-widest text-neon uppercase">
            {project.tag}
          </span>
        </div>

        <dl className="mt-6 space-y-4 text-sm leading-relaxed">
          <div>
            <dt className="font-mono text-[10px] tracking-[0.25em] text-mute uppercase">
              Problème
            </dt>
            <dd className="mt-1 text-fog/90">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.25em] text-mute uppercase">
              Solution
            </dt>
            <dd className="mt-1 text-fog/90">{project.solution}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] tracking-[0.25em] text-mute uppercase">
              Résultat
            </dt>
            <dd className="mt-1 font-medium text-gradient">{project.result}</dd>
          </div>
        </dl>

        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-md bg-elevated px-2.5 py-1 font-mono text-[11px] text-mute"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
