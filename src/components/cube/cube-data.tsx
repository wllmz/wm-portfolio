import type { ReactNode } from "react";

export type FaceKey = "design" | "front" | "api" | "mobile" | "data" | "deploy";
export type FacePosition = "front" | "back" | "right" | "left" | "top" | "bottom";

/** Les 6 faces + l'intérieur (le transversal : tests, sécurité, perf). */
export type PanelKey = FaceKey | "interior";

export type FaceInfo = {
  num: number | string;
  title: string;
  skills: string[];
  ex: ReactNode;
};

/** Contenu des six faces : skills + preuve par un vrai projet. */
export const FACES: Record<FaceKey, FaceInfo> = {
  design: {
    num: 1,
    title: "design",
    skills: ["Figma", "Illustrator", "DA & branding"],
    ex: (
      <>
        Identité complète de <strong>Mellis</strong> : logo, packaging,
        packshots générés par IA.
      </>
    ),
  },
  front: {
    num: 2,
    title: "front",
    skills: ["React", "TypeScript", "CSS"],
    ex: (
      <>
        Le front sur mesure de <strong>Freïa Paris</strong> et ce portfolio,
        animations comprises.
      </>
    ),
  },
  api: {
    num: 3,
    title: "api",
    skills: ["Node.js", "REST", "Socket.io"],
    ex: (
      <>
        L&apos;API de <strong>Dernier Mot</strong> : Node.js, endpoints REST et
        multijoueur temps réel (synchro d&apos;état, latence).
      </>
    ),
  },
  mobile: {
    num: 4,
    title: "mobile",
    skills: ["React Native", "Expo", "iOS & Android"],
    ex: (
      <>
        L&apos;app <strong>Dernier Mot</strong> en React Native + Expo : une
        seule base de code pour iOS et Android.
      </>
    ),
  },
  data: {
    num: 5,
    title: "data",
    skills: ["MongoDB", "Atlas", "Modélisation"],
    ex: (
      <>
        Base <strong>MongoDB Atlas</strong> en production pour l&apos;e-commerce{" "}
        <strong>Freïa Paris</strong>.
      </>
    ),
  },
  deploy: {
    num: 6,
    title: "deploy",
    skills: ["Docker", "Traefik", "VPS", "CI"],
    ex: (
      <>
        L&apos;infra de <strong>Freïa Paris</strong> : VPS, reverse-proxy
        Traefik, conteneurs Docker, fail2ban.
      </>
    ),
  },
};

/**
 * L'intérieur du cube — ce qui tient les six faces.
 * Pas une 7e face : le transversal, invisible sur la démo,
 * décisif en production.
 */
export const INTERIOR: FaceInfo = {
  num: "+",
  title: "l'intérieur",
  skills: ["Tests · Vitest", "Sécurité · HTTPS, fail2ban", "Perf", "Accessibilité"],
  ex: (
    <>
      Ce qui tient les six faces : je <strong>teste</strong> ce que je livre et
      je <strong>sécurise</strong> ce que je déploie. Invisible sur la démo,
      décisif en production.
    </>
  ),
};

/** Toutes les entrées du panneau : les 6 faces + l'intérieur. */
export const PANELS: Record<PanelKey, FaceInfo> = {
  ...FACES,
  interior: INTERIOR,
};

/** Position géométrique de chaque face sur le cube. */
export const FACE_LAYOUT: { position: FacePosition; key: FaceKey }[] = [
  { position: "front", key: "design" },
  { position: "right", key: "front" },
  { position: "top", key: "api" },
  { position: "left", key: "mobile" },
  { position: "bottom", key: "data" },
  { position: "back", key: "deploy" },
];

/** Ordre des boutons de navigation. */
export const NAV_ORDER: FaceKey[] = [
  "design",
  "front",
  "mobile",
  "api",
  "data",
  "deploy",
];

/** Orientation [rotX, rotY] qui présente chaque face à la caméra. */
export const ORIENT: Record<FaceKey, [number, number]> = {
  design: [-10, 16],
  front: [-10, -74],
  mobile: [-10, 106],
  deploy: [-10, 196],
  api: [-80, 16],
  data: [80, 16],
};

/** Rotation chaotique propre à chaque face pendant la déstructuration. */
export const CHAOS: Record<FacePosition, number> = {
  front: -38,
  right: 46,
  top: -52,
  left: 34,
  bottom: -30,
  back: 58,
};
