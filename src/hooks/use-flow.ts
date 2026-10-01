"use client";

import { useSyncExternalStore } from "react";

/** Sous ce seuil, l'accueil n'est plus un slider mais une page qui défile
    (même seuil que le bloc « page qui défile » en fin de globals.css). */
export const FLOW_QUERY = "(max-width: 820px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(FLOW_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Vrai quand l'accueil est en mode page qui défile. Faux côté serveur : le
    premier rendu est celui du slider, le CSS mobile l'aplatit avant même
    l'hydratation. */
export function useFlow() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FLOW_QUERY).matches,
    () => false,
  );
}
