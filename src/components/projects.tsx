"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FACES } from "@/components/cube/cube-data";
import { projects, ALL_FACES } from "@/components/cube/projects-data";

/* même seuil que l'accordéon vertical en CSS. À quatre projets, l'accordéon
   horizontal ne tient plus sous 1024px : les panneaux repliés n'ont plus la
   largeur d'un titre. */
const MOBILE = "(max-width: 1024px)";

export function Projects() {
  /* Desktop : le premier panneau est ouvert d'emblée, sinon la section ne
     montre que trois colonnes muettes. Mobile : tout est replié, les trois
     cartes tiennent alors dans l'écran et on choisit celle qu'on ouvre.
     Le repli se fait après montage — le rendu serveur ne connaît pas la
     largeur de l'écran — mais la section n'est pas le premier slide, donc
     l'effet a joué bien avant qu'on y arrive. */
  const [active, setActive] = useState<number | null>(0);

  useEffect(() => {
    if (window.matchMedia(MOBILE).matches) setActive(null);
  }, []);

  return (
    <section id="projets" className="proj-slide">
      {/* encadré en écho au hero */}
      <div className="proj-frame">
        <header className="proj-head">
          <span className="block text-[0.72rem] font-semibold tracking-[0.24em] text-burgundy uppercase">
            Projets, les vrais en prod
          </span>
          <h2 className="mt-3 font-title text-[clamp(1.7rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight">
            quatre projets,{" "}
            <span className="font-hand text-burgundy">six faces couvertes.</span>
          </h2>
        </header>

        <div className="xpanels">
          {projects.map((project, i) => (
            <div
              key={project.num}
              className={`xpanel${active === i ? " active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="xp-num">{project.num}</span>
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
                    alt={project.title}
                    width={project.logo.w}
                    height={project.logo.h}
                    priority
                  />
                </span>
              ) : (
                <span className="xp-title">{project.title}</span>
              )}
              <div className="xp-reveal">
                <p>{project.desc}</p>
                <div className="pp-faces" aria-label="Faces couvertes">
                  {/* seules les faces couvertes s'affichent — l'ordre reste
                      celui du cube */}
                  {ALL_FACES.filter((face) => project.faces.includes(face)).map(
                    (face) => (
                      <span key={face} className="pp-chip on">
                        {FACES[face].title}
                      </span>
                    ),
                  )}
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
      </div>
    </section>
  );
}
