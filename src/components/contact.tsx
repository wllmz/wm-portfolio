import { ContactForm } from "@/components/contact-form";

export function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-frame">
        <header className="contact-head">
          <p className="contact-eyebrow">Contact</p>
          <h2 className="contact-title">
            un projet en tête&nbsp;?{" "}
            <span className="font-hand text-burgundy">parlons-en.</span>
          </h2>
          <p className="contact-sub">
            Web, mobile, API, infra. Réponse sous 24&nbsp;h, premier échange
            gratuit et sans engagement.
          </p>
        </header>

        <ContactForm />
      </div>
    </section>
  );
}
