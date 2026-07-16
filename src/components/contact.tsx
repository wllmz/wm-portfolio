import { Reveal } from "@/components/reveal";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Halo de fond */}
      <div
        aria-hidden
        className="absolute inset-0 [background:radial-gradient(ellipse_at_bottom,color-mix(in_srgb,var(--color-electric)_14%,transparent),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-4xl px-6 py-32 text-center">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-neon uppercase">
            Contact
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-6xl">
            Un projet en tête&nbsp;?
            <br />
            <span className="text-gradient">Parlons-en.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-mute">
            Réponse sous 24 h. Premier échange gratuit et sans engagement.
          </p>

          <a
            href="mailto:wiwimarti0693@gmail.com"
            className="group mt-10 inline-block rounded-full bg-electric px-8 py-4 text-lg font-medium text-void transition-all duration-300 hover:shadow-[0_0_50px_-8px_var(--color-electric)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon"
          >
            wiwimarti0693@gmail.com
            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
