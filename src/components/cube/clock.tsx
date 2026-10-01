"use client";

import { useEffect, useState } from "react";

/** Heure locale du visiteur, rafraîchie chaque seconde. Isolée dans son
    propre composant : son état ne fait re-rendre qu'elle, pas tout le hero. */
export function Clock() {
  /* même valeur au rendu serveur et au premier rendu client : pas de
     décalage d'hydratation, l'heure réelle arrive à l'effet */
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("fr-FR"));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="clock">{time}</span>;
}
