import { Reveal } from "@/components/reveal";

const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "React Native",
  "Node.js",
  "Fastify",
  "Prisma",
  "PostgreSQL",
  "Tailwind CSS",
  "Zod",
];

export function About() {
  return (
    <section id="a-propos" className="mx-auto max-w-6xl px-6 py-28">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-mute uppercase">
            À propos
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Un seul interlocuteur, de l&apos;idée à la prod
            <span className="text-accent">.</span>
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-mute">
            Développeur full stack, je prends en charge l&apos;ensemble de
            votre projet : conception, développement, déploiement. Pas
            d&apos;intermédiaire, pas de perte d&apos;information — un
            interlocuteur unique qui comprend vos enjeux business autant que
            la technique.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-mute">
            Mon obsession : livrer des produits{" "}
            <span className="font-medium text-ink">
              rapides, fiables et maintenables
            </span>
            , que votre équipe pourra faire évoluer sereinement.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="font-mono text-xs tracking-[0.25em] text-mute uppercase">
            Stack principale
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-4 py-2 font-mono text-xs text-mute transition-colors duration-300 hover:border-ink/40 hover:text-ink"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
