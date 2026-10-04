import { ContactForm } from "@/components/contact-form";

/* ce qui se passe après l'envoi */
const STEPS = [
  "Vous écrivez.",
  "Je réponds sous 24 h.",
  "Un premier échange, gratuit et sans engagement.",
];

export function Contact() {
  return (
    <section
      id="contact"
      className="contact-section"
      aria-labelledby="contact-titre"
    >
      <header>
        <p className="contact-eyebrow">
          <span className="sec-num" aria-hidden="true">
            03
          </span>
          contact
        </p>
        <p className="contact-sub">web, mobile, API, infra</p>
      </header>

      <div className="contact-grid">
        <div className="contact-intro">
          <h2 id="contact-titre" className="contact-title">
            un projet en tête&nbsp;?{" "}
            <span className="contact-hand">parlons-en.</span>
          </h2>
          <div className="contact-next">
            <p className="contact-label">Ensuite</p>
            <ol>
              {STEPS.map((step, i) => (
                <li key={step}>
                  <span aria-hidden="true">{`0${i + 1}`}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
