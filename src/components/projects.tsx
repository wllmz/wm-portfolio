import { Reveal } from "@/components/reveal";

type Project = {
  title: string;
  tag: string;
  description: string;
  result: string;
  stack: string[];
};

// ⚠️ Contenu placeholder — à remplacer par tes vrais projets.
// Garde le format description + résultat chiffré : c'est lui qui vend.
const projects: Project[] = [
  {
    title: "SaaS Dashboard",
    tag: "Web app",
    description:
      "Pilotage d'activité temps réel pour une PME — authentification, rôles, data-viz.",
    result: "−6 h de reporting manuel / semaine",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
  },
  {
    title: "App e-commerce",
    tag: "Mobile",
    description:
      "Application React Native avec catalogue, panier et paiement intégré, publiée sur les stores.",
    result: "+30 % de commandes au premier trimestre",
    stack: ["React Native", "Expo", "Zustand", "Stripe"],
  },
  {
    title: "MVP marketplace",
    tag: "MVP",
    description:
      "MVP full stack livré en 6 semaines : annonces, messagerie, back-office.",
    result: "Concept validé → levée de fonds réussie",
    stack: ["Next.js", "Fastify", "Drizzle", "Zod"],
  },
];

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <article className="group border-t border-line transition-colors duration-400 last:border-b hover:bg-ink">
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-3 px-6 py-10 md:grid-cols-[3.5rem_1fr_auto] md:items-center md:py-12">
        <span className="font-mono text-sm text-mute transition-colors duration-400 group-hover:text-paper/50">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div>
          <h3 className="font-display text-3xl font-bold uppercase tracking-tight transition-colors duration-400 group-hover:text-paper sm:text-4xl lg:text-5xl">
            {project.title}
          </h3>
          <p className="mt-2 max-w-xl text-mute transition-colors duration-400 group-hover:text-paper/70">
            {project.description}
          </p>
          <p className="mt-1 font-medium text-accent transition-colors duration-400 group-hover:text-accent-light">
            {project.result}
          </p>
        </div>

        <div className="flex flex-row items-center gap-3 md:flex-col md:items-end">
          <span className="rounded-full border border-ink/20 px-3 py-1 font-mono text-[10px] tracking-widest text-ink uppercase transition-colors duration-400 group-hover:border-paper/40 group-hover:text-paper">
            {project.tag}
          </span>
          <span className="hidden font-mono text-[11px] text-mute transition-colors duration-400 group-hover:text-paper/50 md:block md:text-right">
            {project.stack.join(" · ")}
          </span>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projets" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-mute uppercase">
            Projets sélectionnés
          </p>
          <h2 className="mt-4 mb-14 font-display text-3xl font-bold uppercase tracking-tight sm:text-5xl">
            Des résultats, pas juste du code
            <span className="text-accent">.</span>
          </h2>
        </Reveal>
      </div>

      <Reveal>
        <div>
          {projects.map((project, i) => (
            <ProjectRow key={project.title} project={project} index={i} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
