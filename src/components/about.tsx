import Image from "next/image";

/* les repères pratiques — ce qu'un client veut savoir avant d'écrire */
const FACTS = [
  { k: "Statut", v: "Freelance" },
  { k: "Où", v: "Paris ou remote" },
  { k: "Réponse", v: "Sous 24 h" },
  { k: "Premier échange", v: "Gratuit" },
];

export function About() {
  return (
    <section id="a-propos" className="about-slide">
      <div className="about-frame">
        <header className="about-head">
          <span className="block text-[0.72rem] font-semibold tracking-[0.24em] text-burgundy uppercase">
            À propos
          </span>
          <h2 className="mt-3 font-title text-[clamp(1.7rem,4vw,3rem)] font-bold leading-[1.08] tracking-tight">
            votre produit,{" "}
            <span className="font-hand text-burgundy">de l&apos;idée au déploiement.</span>
          </h2>
        </header>

        <div className="about-grid">
          <div className="about-photo">
            <Image
              src="/profile.jpg"
              alt="Portrait de William Martinez"
              width={1242}
              height={1457}
              sizes="(max-width: 820px) 160px, 300px"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="about-text">
            <p className="about-lead">
              Je couvre tout le cycle d&apos;un produit,{" "}
              <span className="font-hand text-burgundy">
                seul, ou avec votre équipe.
              </span>
            </p>
            <p>
              Moi, c&apos;est <strong>William</strong>, développeur full stack
              indépendant. Je conçois, je code, je déploie et j&apos;assure le
              suivi une fois le projet en ligne.
            </p>
            <p>
              En solo, vous avez un seul interlocuteur du premier échange à la
              maintenance. En équipe, je travaille avec vos développeurs et vos
              designers. C&apos;est ce que j&apos;ai fait chez{" "}
              <strong>Alcma</strong>, agence web : un ERP développé en binôme,
              avec un designer UX/UI.
            </p>
            <dl className="about-facts">
              {FACTS.map((f) => (
                <div key={f.k}>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
