"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

/* Sous 1024px, l'accordéon passe à la verticale (CSS) : à quatre projets,
   les panneaux horizontaux repliés n'ont plus la largeur d'un titre. Une
   tablette en portrait est assez haute pour garder la première carte
   ouverte : seuls les téléphones et les écrans courts replient tout. */
const COLLAPSED =
  "(max-width: 560px), (max-width: 1024px) and (max-height: 900px)";

/** Ce que le panneau affiche d'un projet — et rien de plus : le détail
    (contexte, captures…) reste côté serveur, hors du bundle de l'accueil. */
export type ProjectPanel = {
  slug: string;
  num: string;
  title: string;
  logo?: { src: string; w: number; h: number };
  desc: ReactNode;
  /** titres des faces couvertes, dans l'ordre du cube */
  faces: string[];
};

export function ProjectsAccordion({ items }: { items: ProjectPanel[] }) {
  /* Desktop et tablette portrait : le premier panneau est ouvert d'emblée,
     sinon la section ne montre que des panneaux muets. Téléphone et écran
     court : tout est replié, les cartes tiennent alors dans l'écran et on
     choisit celle qu'on ouvre. Le repli se fait après montage — le rendu
     serveur ne connaît pas l'écran — mais la section n'est pas le premier
     slide, donc l'effet a joué bien avant qu'on y arrive. */
  const [active, setActive] = useState<number | null>(0);

  useEffect(() => {
    if (window.matchMedia(COLLAPSED).matches) setActive(null);
  }, []);

  return (
    <div className="xpanels">
      {items.map((project, i) => (
        <div
          key={project.num}
          className={`xpanel${active === i ? " active" : ""}`}
          onMouseEnter={() => setActive(i)}
          onClick={() => setActive(i)}
          /* onFocus remonte depuis le bouton comme depuis le lien : un
             retour en Shift+Tab sur le lien rouvre aussi son panneau */
          onFocus={() => setActive(i)}
        >
          {/* le panneau s'ouvre au survol ou au clic ; ce bouton invisible
              l'ouvre aussi au clavier, sinon seul le premier projet est
              atteignable en tabulant. Le focus se voit sur le panneau. */}
          <button
            type="button"
            className="xp-toggle sr-only"
            aria-expanded={active === i}
            aria-controls={`xp-reveal-${project.slug}`}
          >
            {`Projet ${project.num} : ${project.title}`}
          </button>
          <span className="xp-num" aria-hidden="true">
            {project.num}
          </span>
          {project.logo ? (
            /* un logotype large et un logo carré ne se calent pas sur la
               même hauteur : à hauteur égale, le carré pèse deux fois
               moins. On le signale au CSS. */
            <span
              className={`xp-logo${
                project.logo.w / project.logo.h < 1.4 ? " xp-logo--square" : ""
              }`}
            >
              <Image
                src={project.logo.src}
                alt=""
                width={project.logo.w}
                height={project.logo.h}
              />
            </span>
          ) : (
            <span className="xp-title">{project.title}</span>
          )}
          <div className="xp-reveal" id={`xp-reveal-${project.slug}`}>
            <p>{project.desc}</p>
            <div className="pp-faces" aria-label="Faces couvertes">
              {/* seules les faces couvertes s'affichent — l'ordre reste
                  celui du cube */}
              {project.faces.map((title) => (
                <span key={title} className="pp-chip on">
                  {title}
                </span>
              ))}
            </div>
            <Link
              href={`/projets/${project.slug}`}
              className="xp-more"
              onClick={(e) => e.stopPropagation()}
            >
              voir le détail →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
