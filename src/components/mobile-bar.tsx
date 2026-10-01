/** Barre de navigation du mobile : sous 820px, l'accueil n'est plus un
    slider mais une page qui défile, et cette barre reste en haut pour sauter
    d'une section à l'autre. Masquée sur desktop (CSS), où les points du
    slider jouent ce rôle. */
export function MobileBar() {
  return (
    <nav className="mobile-bar" aria-label="Sections">
      <a href="#stage" className="mobile-bar-logo" aria-label="Haut de page">
        wm<span className="text-burgundy">.</span>
      </a>
      <div className="mobile-bar-links">
        <a href="#projets">Projets</a>
        <a href="#a-propos">À propos</a>
        <a href="#contact" className="mobile-bar-cta">
          Contact
        </a>
      </div>
    </nav>
  );
}
