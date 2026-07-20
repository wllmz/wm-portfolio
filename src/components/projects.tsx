"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { FACES } from "@/components/cube/cube-data";
import { projects, ALL_FACES } from "@/components/cube/projects-data";

/* texte provisoire — à remplacer par les vraies études de cas */
const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam quis risus eget urna mollis ornare vel eu leo.",
  "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper.",
  "Maecenas faucibus mollis interdum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Aenean lacinia bibendum nulla sed consectetur.",
];

export function Projects() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const opened = open !== null ? projects[open] : null;

  return (
    <section id="projets" className="proj-slide">
      {/* encadré en écho au hero */}
      <div className="proj-frame">
        <header className="proj-head">
          <span className="block text-[0.72rem] font-semibold tracking-[0.24em] text-burgundy uppercase">
            Projets — les vrais, en prod
          </span>
          <h2 className="mt-3 font-title text-[clamp(1.7rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight">
            trois projets,{" "}
            <span className="font-hand text-burgundy">six faces couvertes.</span>
          </h2>
        </header>

        <div className="xpanels">
          {projects.map((project, i) => (
            <div
              key={project.num}
              className={`xpanel xp-${project.variant}${
                project.variant !== "line" ? " xp-on-dark" : ""
              }${active === i ? " active" : ""}`}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="xp-num">{project.num}</span>
              <span className="xp-title">{project.title}</span>
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
                <button
                  className="xp-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(i);
                  }}
                >
                  voir le détail →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* la popup doit sortir du slider (transform de la piste) → portal body */}
      {opened &&
        createPortal(
          <div
            className="proj-modal"
            role="dialog"
            aria-modal="true"
            aria-label={opened.title}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(null);
            }}
          >
            <button
              className="pm-close"
              aria-label="Fermer"
              onClick={() => setOpen(null)}
            >
              ✕
            </button>
            <div className="pm-inner">
              <span className="pm-num" aria-hidden="true">
                {opened.num}
              </span>
              <h2 className="pm-title">{opened.title}</h2>
              <div className="pm-faces" aria-label="Faces couvertes">
                {ALL_FACES.filter((face) => opened.faces.includes(face)).map(
                  (face) => (
                    <span key={face} className="pp-chip on">
                      {FACES[face].title}
                    </span>
                  ),
                )}
              </div>
              <div className="pm-body">
                {LOREM.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
