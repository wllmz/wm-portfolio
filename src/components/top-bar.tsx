/** Barre de navigation : l'accueil est une page qui défile, cette barre reste
    en haut pour sauter d'une section à l'autre. */
export function TopBar() {
  return (
    <nav className="top-bar" aria-label="Sections">
      <a href="#stage" className="top-bar-logo" aria-label="wm., haut de page">
        wm<span className="text-burgundy">.</span>
      </a>
      <div className="top-bar-links">
        <a href="#projets">Projets</a>
        <a href="#a-propos">À propos</a>
        <a href="#contact" className="top-bar-cta">
          Contact
        </a>
      </div>
    </nav>
  );
}
