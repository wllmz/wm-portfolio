import Image from "next/image";

/** À propos, en colophon : le nom en très grand avec la photo glissée à côté
    comme une signature, puis des colonnes étiquetées, à la manière du détail
    d'un projet juste au-dessus. */
export function About() {
  return (
    <section id="a-propos" className="colo" aria-labelledby="a-propos-titre">
      <header>
        <h2 id="a-propos-titre" className="colo-title">
          <span className="sec-num" aria-hidden="true">
            02
          </span>
          à propos
        </h2>
        <p className="colo-sub">la personne derrière les projets</p>
      </header>

      <div className="colo-hero">
        <p className="colo-name">
          William
          <br />
          Martinez<span>.</span>
        </p>
        <figure className="colo-photo">
          <div className="colo-photo-frame">
            <Image
              src="/profile.jpg"
              alt="Portrait de William Martinez"
              fill
              sizes="(max-width: 820px) 110px, 150px"
            />
          </div>
          <figcaption>c&apos;est moi.</figcaption>
        </figure>
      </div>

      <div className="colo-cols">
        <div>
          <h3 className="colo-label">Le métier</h3>
          <p>
            Développeur full stack indépendant. Je conçois, je code, je déploie
            et j&apos;assure le suivi une fois le projet en ligne.
          </p>
        </div>
        <div>
          <h3 className="colo-label">La façon</h3>
          <p>
            En solo, un seul interlocuteur du premier échange à la maintenance.
            En équipe, avec vos développeurs et vos designers, comme chez{" "}
            <strong>Alcma</strong>.
          </p>
        </div>
        <div>
          <h3 className="colo-label">Statut · Où</h3>
          <p className="colo-fact">
            Freelance
            <br />
            Paris ou remote
          </p>
        </div>
        <div>
          <h3 className="colo-label">Réponse · 1er échange</h3>
          <p className="colo-fact">
            Sous 24&nbsp;h
            <br />
            Gratuit
          </p>
        </div>
      </div>
    </section>
  );
}
