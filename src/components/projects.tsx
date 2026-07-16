import { Reveal } from "@/components/reveal";
import { ProjectCard, type Project } from "@/components/project-card";

// ⚠️ Contenu placeholder — à remplacer par tes vrais projets.
// Garde le format problème → solution → résultat chiffré : c'est lui qui vend.
const projects: Project[] = [
  {
    title: "SaaS Dashboard",
    tag: "Web app",
    problem:
      "Une PME pilotait son activité sur des tableurs éparpillés, sans vision temps réel.",
    solution:
      "Dashboard Next.js avec authentification, rôles et visualisation de données temps réel.",
    result: "−6 h de reporting manuel par semaine pour l'équipe.",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
  },
  {
    title: "App mobile e-commerce",
    tag: "Mobile",
    problem:
      "Un commerçant perdait des ventes faute de présence mobile face à ses concurrents.",
    solution:
      "Application React Native (Expo) avec catalogue, panier et paiement intégré.",
    result: "+30 % de commandes dès le premier trimestre.",
    stack: ["React Native", "Expo", "Zustand", "Stripe"],
  },
  {
    title: "MVP marketplace",
    tag: "MVP",
    problem:
      "Une startup devait valider son concept rapidement avant sa levée de fonds.",
    solution:
      "MVP full stack livré en 6 semaines : annonces, messagerie et back-office.",
    result: "Concept validé, levée de fonds réussie.",
    stack: ["Next.js", "Fastify", "Drizzle", "Zod"],
  },
];

export function Projects() {
  return (
    <section id="projets" className="relative mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.3em] text-neon uppercase">
          Projets sélectionnés
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
          Des résultats, pas juste du code<span className="text-electric">.</span>
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.12}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
