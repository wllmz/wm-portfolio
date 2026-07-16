import { Reveal } from "@/components/reveal";

export function Contact() {
  return (
    <section id="contact" className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-32">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.3em] text-paper/50 uppercase">
            Contact
          </p>

          <a
            href="mailto:wiwimarti0693@gmail.com"
            className="group mt-8 block font-display text-[clamp(2.6rem,10vw,8.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight transition-colors duration-300 hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-light"
          >
            Parlons-en
            <span className="ml-4 inline-block text-accent-light transition-transform duration-300 group-hover:translate-x-4">
              →
            </span>
          </a>

          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-paper/15 pt-8 text-sm text-paper/60">
            <p>Réponse sous 24 h — premier échange gratuit et sans engagement.</p>
            <p className="font-mono">wiwimarti0693@gmail.com</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
