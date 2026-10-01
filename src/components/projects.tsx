import { FACES, FACE_ORDER } from "@/data/cube-faces";
import { projects } from "@/data/projects";
import {
  ProjectsAccordion,
  type ProjectPanel,
} from "@/components/projects-accordion";

/* composant serveur : seuls les champs affichés par les panneaux partent
   au navigateur */
const panels: ProjectPanel[] = projects.map((project) => ({
  slug: project.slug,
  num: project.num,
  title: project.title,
  logo: project.logo,
  desc: project.desc,
  /* seules les faces couvertes s'affichent — l'ordre reste celui du cube */
  faces: FACE_ORDER.filter((face) => project.faces.includes(face)).map(
    (face) => FACES[face].title,
  ),
}));

export function Projects() {
  return (
    <section id="projets" className="proj-slide">
      {/* encadré en écho au hero */}
      <div className="proj-frame">
        <header className="proj-head">
          <span className="block text-[0.72rem] font-semibold tracking-[0.24em] text-burgundy uppercase">
            Projets livrés et en cours
          </span>
          <h2 className="mt-3 font-title text-[clamp(1.7rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight">
            quatre projets,{" "}
            <span className="font-hand text-burgundy">six faces couvertes.</span>
          </h2>
        </header>

        <ProjectsAccordion items={panels} />
      </div>
    </section>
  );
}
