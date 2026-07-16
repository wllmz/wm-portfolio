import { Reveal } from "@/components/reveal";

const services = [
  {
    num: "01",
    title: "Application web",
    description:
      "Sites et applications Next.js performants, du site vitrine au SaaS complet. SEO, accessibilité et performances soignés.",
  },
  {
    num: "02",
    title: "Application mobile",
    description:
      "Apps iOS et Android en React Native (Expo) : une seule base de code, une expérience native, publiée sur les stores.",
  },
  {
    num: "03",
    title: "MVP express",
    description:
      "Votre idée en production en quelques semaines. Périmètre resserré, itérations rapides, budget maîtrisé.",
  },
];

const steps = [
  { num: "1", label: "Appel découverte", detail: "30 min, gratuit" },
  { num: "2", label: "Proposition", detail: "périmètre, planning, budget" },
  { num: "3", label: "Développement", detail: "démos chaque semaine" },
  { num: "4", label: "Livraison", detail: "mise en prod + suivi" },
];

export function Services() {
  return (
    <section id="services" className="relative border-y border-line bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 py-28">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-neon uppercase">
            Services
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-5xl">
            Ce que je peux faire pour vous
            <span className="text-electric">.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.num} delay={i * 0.1} className="h-full">
              <div className="group h-full bg-void p-8 transition-colors duration-500 hover:bg-elevated">
                <span className="font-mono text-sm text-electric">
                  {service.num}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Process — rassure sur la façon de travailler */}
        <Reveal delay={0.15}>
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <li key={step.num} className="flex items-start gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-electric/40 font-mono text-xs text-electric">
                  {step.num}
                </span>
                <div>
                  <p className="font-medium text-fog">{step.label}</p>
                  <p className="text-sm text-mute">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
