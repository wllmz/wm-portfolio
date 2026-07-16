import { Reveal } from "@/components/reveal";
import { FACES, type FaceKey } from "@/components/cube/cube-data";

const ALL_FACES: FaceKey[] = [
  "design",
  "front",
  "api",
  "data",
  "deploy",
  "interior",
];

type Project = {
  num: string;
  title: string;
  desc: React.ReactNode;
  faces: FaceKey[];
  card: { label: string; hint: string; variant: "navy" | "burgundy" | "line" };
};

const projects: Project[] = [
  {
    num: "01",
    title: "Dernier Mot",
    desc: (
      <>
        Jeu mobile de mots au tour par tour,{" "}
        <strong>multijoueur temps réel</strong>. Conçu, développé et déployé en
        solo — les six faces d&apos;un coup.
      </>
    ),
    faces: ["design", "front", "api", "data", "deploy", "interior"],
    card: { label: "dernier mot", hint: "mockup de l'app ici", variant: "navy" },
  },
  {
    num: "02",
    title: "Freïa Paris",
    desc: (
      <>
        E-commerce d&apos;une marque de sacs artisanaux : front sur mesure et{" "}
        <strong>toute l&apos;infra derrière</strong> — VPS, Traefik, Docker. Un
        vrai site marchand.
      </>
    ),
    faces: ["design", "front", "data", "deploy", "interior"],
    card: { label: "freïa", hint: "screenshot du site ici", variant: "burgundy" },
  },
  {
    num: "03",
    title: "Mellis",
    desc: (
      <>
        Marque fictive de cosmétiques au miel : identité, packaging et
        packshots <strong>générés par IA</strong>. Mon terrain de jeu direction
        artistique.
      </>
    ),
    faces: ["design"],
    card: { label: "mellis", hint: "packshots ici", variant: "line" },
  },
];

const cardVariants = {
  navy: "bg-navy text-cream shadow-[0_18px_44px_rgba(35,43,78,0.16)]",
  burgundy: "bg-burgundy text-cream shadow-[0_18px_44px_rgba(35,43,78,0.16)]",
  line: "border-[1.5px] border-navy/35 text-navy",
};

export function Projects() {
  return (
    <section id="projets" className="relative pb-32 pt-[4vh]">
      <div className="mx-auto max-w-[1100px] px-9">
        {projects.map((project, i) => (
          <article
            key={project.num}
            className="grid items-center gap-9 border-navy/15 py-14 md:grid-cols-[1.05fr_1fr] md:gap-16 md:py-19 [&+&]:border-t-[1.5px]"
          >
            <Reveal className={i % 2 === 1 ? "md:order-2" : undefined}>
              <span
                aria-hidden="true"
                className="mb-2.5 block font-hand text-[clamp(3rem,6vw,5rem)] leading-none text-burgundy opacity-80"
              >
                {project.num}
              </span>
              <h3 className="mb-3 font-title text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold tracking-tight">
                {project.title}
              </h3>
              <p className="mb-6 max-w-[42ch] leading-[1.65] text-ink-soft [&_strong]:font-semibold [&_strong]:text-navy">
                {project.desc}
              </p>
              <div
                className="mb-7 flex flex-wrap gap-[7px]"
                aria-label="Faces couvertes par ce projet"
              >
                {ALL_FACES.map((face) => {
                  const on = project.faces.includes(face);
                  return (
                    <span
                      key={face}
                      className={`rounded-full border-[1.5px] px-3 py-1.5 text-[0.68rem] font-semibold tracking-[0.14em] uppercase ${
                        on
                          ? "border-burgundy bg-burgundy text-cream"
                          : "border-navy/20 text-navy/40"
                      }`}
                    >
                      {FACES[face].title}
                    </span>
                  );
                })}
              </div>
              {/* TODO: liens vers les pages case study quand elles existeront */}
              <span className="inline-flex items-center gap-2 font-title text-navy/50">
                Case study en préparation
              </span>
            </Reveal>

            <Reveal
              delay={0.1}
              className={i % 2 === 1 ? "md:order-1" : undefined}
            >
              <div
                className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[18px] transition-transform duration-500 [transition-timing-function:var(--ease-out)] hover:-translate-y-1.5 hover:-rotate-[0.5deg] ${cardVariants[project.card.variant]}`}
              >
                <span className="font-hand text-[clamp(1.8rem,3.6vw,3rem)] font-bold tracking-tight opacity-90">
                  {project.card.label}
                </span>
                {/* TODO: remplacer par un vrai visuel (mockup / screenshot) */}
                <span className="absolute bottom-3.5 text-[0.66rem] font-semibold tracking-[0.18em] uppercase opacity-40">
                  {project.card.hint}
                </span>
              </div>
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}
