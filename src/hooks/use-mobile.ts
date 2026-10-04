"use client";

import { useSyncExternalStore } from "react";

/** Sous ce seuil, le hero passe en mise en page mobile et la carte d'une face
    s'ouvre en plein écran (même seuil que le bloc mobile de globals.css). */
export const MOBILE_QUERY = "(max-width: 820px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Vrai sous le seuil mobile. Faux côté serveur : le premier rendu est celui
    du desktop, le CSS mobile s'applique avant même l'hydratation. */
export function useMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}
