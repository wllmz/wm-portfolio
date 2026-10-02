"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { projects, type Project, type Shot } from "@/data/projects";

/* TypeScript est partout : il ne distingue aucun projet, le panneau montre
   le reste de la stack */
const stackOf = (project: Project) =>
  project.stack.filter((tool) => tool !== "TypeScript").slice(0, 4);

/* hauteur de la barre du haut : la scène se colle juste dessous */
const TOP_BAR = 56;

/** La mise en scène des captures dans la moitié visuel du panneau. */
function PanelVisual({ project }: { project: Project }) {
  const [first, second] = project.shots;
  if (!first) return null;

  if (project.panel.visual === "photo") {
    return (
      <Image
        className="pn-photo"
        src={first.src}
        alt={first.alt}
        fill
        sizes="(max-width: 820px) 100vw, 50vw"
      />
    );
  }
  if (project.panel.visual === "browser") {
    return (
      <div className="pn-browser">
        <span className="pn-browser-bar" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <Image
          src={first.src}
          alt={first.alt}
          width={first.w}
          height={first.h}
          sizes="(max-width: 820px) 84vw, 42vw"
        />
      </div>
    );
  }
  const frame = { "--frame": project.panel.frame } as CSSProperties;
  return (
    <div className="pn-phones" style={frame}>
      {[first, second]
        .filter((shot): shot is Shot => !!shot)
        .map((shot) => (
        <span key={shot.src} className="pn-phone">
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(max-width: 820px) 32vw, 260px"
          />
        </span>
      ))}
    </div>
  );
}

/** Les projets : un panneau plein écran par projet, chacun dans l'univers de
    sa marque. La scène reste collée sous la barre du haut le temps de passer
    les quatre panneaux : un écran de défilement par projet. Le défilement
    choisit le panneau affiché, les flèches font défiler jusqu'au suivant
    (une seule source de vérité : la position dans la page). Le suivant
    monte du bas et recouvre le précédent, qui recule. Sans JS, les
    panneaux s'empilent simplement. */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [index, setIndex] = useState(0);
  const count = projects.length;

  useEffect(() => {
    setPinned(true);
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      const step = stage.offsetHeight;
      const scrolled = TOP_BAR - section.getBoundingClientRect().top;
      const next = Math.round(scrolled / step);
      setIndex(Math.min(count - 1, Math.max(0, next)));
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
  }, [count]);

  /* les flèches défilent jusqu'au panneau voulu : le défilement fait le
     reste, comme à la molette */
  const goTo = useCallback((target: number) => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const top =
      window.scrollY +
      section.getBoundingClientRect().top -
      TOP_BAR +
      target * stage.offsetHeight;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
  }, []);

  return (
    <section
      id="projets"
      ref={sectionRef}
      className={`panels${pinned ? " is-pinned" : ""}`}
      style={{ "--count": count } as CSSProperties}
      aria-labelledby="projets-titre"
    >
      <div className="panels-stage" ref={stageRef}>
        <h2 id="projets-titre" className="panels-label">
          Projets livrés et en cours
        </h2>

        {projects.map((project, i) => {
          const state =
            i < index ? "is-past" : i === index ? "is-active" : "is-next";
          /* scène collée : seul le panneau affiché est atteignable au
             clavier et au lecteur d'écran (inert retire aussi le reste
             de l'arbre d'accessibilité) */
          const hidden = pinned && i !== index;
          const universe = {
            "--stage": project.panel.stage,
            "--bg": project.panel.bg,
            "--fg": project.panel.fg,
            "--cta": project.panel.cta,
            "--cta-text": project.panel.ctaText,
            zIndex: i + 1,
          } as CSSProperties;
          return (
            <article
              key={project.slug}
              className={`panel ${state}`}
              style={universe}
              inert={hidden}
            >
              <div className="pn-visual">
                <PanelVisual project={project} />
              </div>
              <div className="pn-body">
                <p className="pn-name">
                  {project.num}. {project.title}
                  <span className="pn-kind">
                    {project.kind} · {project.status}
                  </span>
                </p>
                <h3 className="pn-title">{project.panel.title}</h3>
                <p className="pn-text">{project.panel.text}</p>
                <p className="pn-stack">{stackOf(project).join(" · ")}</p>
                <Link href={`/projets/${project.slug}`} className="pn-cta">
                  Voir le projet <span aria-hidden="true">→</span>
                </Link>
                <p className="pn-progress" aria-hidden="true">
                  {project.num} / {String(count).padStart(2, "0")}
                </p>
              </div>
            </article>
          );
        })}

        {pinned && (
          <div className="panels-nav">
            <button
              type="button"
              aria-label="Projet précédent"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Projet suivant"
              disabled={index === count - 1}
              onClick={() => goTo(index + 1)}
            >
              ↓
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
