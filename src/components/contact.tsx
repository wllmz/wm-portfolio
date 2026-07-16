import { Reveal } from "@/components/reveal";
import { Magnetic } from "@/components/magnetic";

export function Contact() {
  return (
    <section id="contact" className="px-6 pb-12 sm:px-9">
      <Reveal>
        <div className="mx-auto max-w-[1100px] rounded-[26px] bg-navy px-7 py-16 text-center text-cream shadow-[0_24px_60px_rgba(35,43,78,0.32)] sm:px-12 sm:py-20">
          <p className="text-[0.74rem] font-semibold tracking-[0.24em] text-cream/60 uppercase">
            Contact
          </p>
          <h2 className="mt-4 font-title text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.1] tracking-tight">
            un projet en tête&nbsp;?
            <br />
            <span className="font-hand">parlons-en.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md leading-relaxed text-cream/65">
            Web, mobile, API, infra — je couvre les six faces. Réponse sous
            24&nbsp;h, premier échange gratuit et sans engagement.
          </p>

          <Magnetic>
            <a
              href="mailto:wiwimarti0693@gmail.com"
              className="group mt-9 inline-block max-w-full break-all rounded-full bg-cream px-6 py-3.5 font-title text-sm font-semibold text-navy transition-[scale,box-shadow] duration-300 [transition-timing-function:var(--ease-boing)] hover:scale-[1.04] hover:shadow-[0_14px_34px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-offset-4 focus-visible:outline-cream sm:break-normal sm:px-8 sm:py-4 sm:text-lg"
            >
              wiwimarti0693@gmail.com
              <span className="ml-2 inline-block transition-transform duration-300 [transition-timing-function:var(--ease-boing)] group-hover:translate-x-1.5">
                →
              </span>
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
