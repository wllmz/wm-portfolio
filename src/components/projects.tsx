"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { FACES, FACE_ORDER } from "@/data/cube-faces";
import { projects, type Project } from "@/data/projects";
import { ProjectModal } from "@/components/project-modal";

/* hauteur de la barre du haut : la scène se colle juste dessous */
const TOP_BAR = 56;

/* capture portrait → l'écran prend la forme d'un téléphone, paysage → celle
   d'un navigateur */
const isPhone = (project: Project) => {
  const cover = project.shots[0];
  return !!cover && cover.h > cover.w;
};

/* « Design, front, back. » : les faces du cube que couvre le projet */
const facesOf = (project: Project) => {
  const titles = FACE_ORDER.filter((face) => project.faces.includes(face)).map(
    (face) => FACES[face].title,
  );
  if (titles.length === FACE_ORDER.length)
    return "Les six, du design au suivi.";
  const text = titles.join(", ");
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
};

/** Les projets, un écran à la fois. La scène reste collée sous la barre du
    haut le temps d'un écran de défilement par projet. À gauche, le nom du
    projet défile ; au centre, un écran prend la forme du projet (téléphone
    ou navigateur) et en montre la capture ; à droite, le détail. Le
    défilement choisit le projet affiché, les flèches font défiler jusqu'au
    suivant (une seule source de vérité : la position dans la page). Sans
    JS, la liste s'affiche simplement à plat. */
export function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [index, setIndex] = useState(0);
  /* le projet ouvert en popup, figé au clic : le défilement derrière ne le
     change pas */
  const [opened, setOpened] = useState<{
    project: Project;
    origin: HTMLElement;
  } | null>(null);
  const count = projects.length;

  /* avant le premier affichage : la section prend tout de suite sa hauteur
     collée, la position restaurée au retour d'une page projet ne saute pas */
  useLayoutEffect(() => {
    setPinned(true);
  }, []);

  useEffect(() => {
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

  /* les flèches défilent jusqu'au projet voulu : le défilement fait le
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
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
  }, []);

  /* un clic sur l'écran ouvre le détail en popup, qui s'agrandit depuis
     lui. Ctrl/Cmd + clic et clic molette gardent le lien vers la page
     projet (nouvel onglet). */
  const openProject = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      return;
    e.preventDefault();
    setOpened({ project: projects[index], origin: e.currentTarget });
  };

  /* position de chaque projet par rapport au projet affiché : -1 déjà vu,
     0 affiché, 1 à venir. Sans JS (scène non collée), tous sont à plat. */
  const offsetOf = (i: number) =>
    !pinned ? 0 : i < index ? -1 : i === index ? 0 : 1;
  const active = projects[index];
  const last = index === count - 1;

  return (
    <section
      id="projets"
      ref={sectionRef}
      className={`ecran${pinned ? " is-pinned" : ""}`}
      style={{ "--count": count } as CSSProperties}
      aria-labelledby="projets-titre"
    >
      {/* un point d'arrêt du défilement par projet (cf. le défilement par
          écran, globals.css) */}
      {pinned &&
        Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className="ec-snap"
            style={{ "--i": i } as CSSProperties}
            aria-hidden="true"
          />
        ))}
      <div className="ecran-stage" ref={stageRef}>
        <header className="ec-head">
          <h2 id="projets-titre" className="ec-title">
            <span className="sec-num" aria-hidden="true">
              01
            </span>
            projets
          </h2>
          <p className="ec-sub">livrés et en cours · du design à la prod</p>
          <div className="ec-dashes" aria-hidden="true">
            {projects.map((project, i) => (
              <span
                key={project.slug}
                className={i === index ? "on" : undefined}
              />
            ))}
          </div>
        </header>

        {/* au centre : l'écran, qui prend la forme du projet affiché ; un
            clic ouvre sa page */}
        <Link
          href={`/projets/${active.slug}`}
          className={`ec-screen ${isPhone(active) ? "is-phone" : "is-web"}`}
          aria-label={`Ouvrir le projet ${active.title}`}
          onClick={openProject}
        >
          <span className="ec-bar">
            <span />
            <span />
            <span />
          </span>
          <div className="ec-view">
            {projects.map((project, i) => {
              const cover = project.shots[0];
              if (!cover) return null;
              return (
                <Image
                  key={project.slug}
                  className={i === index ? "on" : undefined}
                  src={cover.src}
                  alt=""
                  fill
                  sizes="(max-width: 820px) 90vw, (max-width: 1100px) and (orientation: portrait) 80vw, 600px"
                />
              );
            })}
          </div>
        </Link>

        {projects.map((project, i) => {
          const offset = offsetOf(i);
          return (
            <article
              key={project.slug}
              className={`ec-item${offset === 0 ? " is-on" : ""}`}
              style={{ "--offset": offset } as CSSProperties}
              /* scène collée : seul le projet affiché est atteignable au
                 clavier et au lecteur d'écran */
              inert={pinned && offset !== 0}
            >
              <div className="ec-name">
                <p className="ec-num" aria-hidden="true">
                  {project.num}
                </p>
                <h3>{project.title}</h3>
                {/* répété dans le détail : lu une seule fois */}
                <p className="ec-kind" aria-hidden="true">
                  {project.kind}
                </p>
              </div>

              <div className="ec-detail">
                <p className="ec-role">{project.kind}</p>
                <p className="ec-status">
                  ({project.num}) · {project.status}
                </p>
                <p className="ec-label">Le projet</p>
                <p>{project.tagline}</p>
                <p className="ec-label">Ce que j&apos;ai livré</p>
                <ul>
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="ec-faces">
                  <p className="ec-label">Faces couvertes</p>
                  <p>{facesOf(project)}</p>
                </div>
              </div>
            </article>
          );
        })}

        {pinned && (
          <div className="ec-nav">
            <button
              type="button"
              aria-label="Projet précédent"
              /* aria-disabled plutôt que disabled : le bouton garde le
                 focus en arrivant au bout de la liste */
              aria-disabled={index === 0}
              onClick={() => index > 0 && goTo(index - 1)}
            >
              ↑
            </button>
            {/* au dernier projet, la flèche mène à la section suivante */}
            <button
              type="button"
              aria-label={
                last ? "Section suivante : à propos" : "Projet suivant"
              }
              onClick={() =>
                last
                  ? document.getElementById("a-propos")?.scrollIntoView()
                  : goTo(index + 1)
              }
            >
              ↓
            </button>
            <p className="sr-only" aria-live="polite">
              Projet {index + 1} sur {count} : {active.title}
            </p>
            <span className="ec-hint" aria-hidden="true">
              {last ? "puis, à propos" : "ou faites défiler"}
            </span>
          </div>
        )}
      </div>

      {opened && (
        <ProjectModal
          project={opened.project}
          origin={opened.origin}
          onClosed={() => setOpened(null)}
        />
      )}
    </section>
  );
}
