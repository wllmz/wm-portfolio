import Image from "next/image";
import Link from "next/link";
import { projects, type Project } from "@/data/projects";

/* TypeScript est partout : il ne distingue aucun projet, la carte montre le
   reste de la stack */
const stackOf = (project: Project) =>
  project.stack.filter((tool) => tool !== "TypeScript").slice(0, 4);


/* une app posée sur un aplat foncé passe le texte de la carte en crème */
const isDark = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const lum = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum < 128;
};

/* La grille bento donne sa place à chaque projet selon son rang : le premier
   en grande carte, le deuxième en carte large, les suivants en petites
   cartes. Le CSS lit le rang (nth-child), le balisage reste le même. */
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
            <span className="font-hand text-burgundy">du design à la prod.</span>
          </h2>
        </header>

        <ul className="bento">
          {projects.map((project) => {
            const cover = project.shots[0];
            /* capture portrait → écran de téléphone ; paysage → fenêtre de
               navigateur. Seule la capture affichée compte : MyLizy mêle
               les deux, sa première est un écran mobile. */
            const phone = !!cover && cover.h > cover.w;
            /* l'aplat de l'app (celui de sa tuile) habille la carte des
               projets mobiles ; les sites gardent le papier */
            const bg = phone ? project.tileIcon?.bg : undefined;
            return (
              <li
                key={project.slug}
                className={`bento-card${phone ? " is-phone" : " is-browser"}${
                  bg && isDark(bg) ? " is-dark" : ""
                }`}
                style={bg ? { background: bg } : undefined}
              >
                <Link href={`/projets/${project.slug}`} className="bc-link">
                  {cover && (
                    <span className="bc-media" aria-hidden="true">
                      {!phone && (
                        <span className="bc-bar">
                          <span />
                          <span />
                          <span />
                        </span>
                      )}
                      <span className="bc-shot">
                        <Image
                          src={cover.src}
                          alt=""
                          fill
                          sizes="(max-width: 820px) 92vw, 50vw"
                        />
                      </span>
                    </span>
                  )}
                  <span className="bc-body">
                    <span className="bc-top">
                      {project.logo ? (
                        <Image
                          className={`bc-logo${
                            project.logo.w / project.logo.h < 1.4
                              ? " bc-logo--square"
                              : ""
                          }`}
                          src={project.logo.src}
                          alt={project.title}
                          width={project.logo.w}
                          height={project.logo.h}
                        />
                      ) : (
                        <span className="bc-title">{project.title}</span>
                      )}
                      <span className="bc-status">{project.status}</span>
                    </span>
                    <span className="bc-kind">{project.kind}</span>
                    <span className="bc-tagline">{project.tagline}</span>
                    <span className="bc-stack">
                      {stackOf(project).join(" · ")}
                    </span>
                  </span>
                  <span className="bc-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
