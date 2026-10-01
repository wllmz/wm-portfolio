import type { ReactNode } from "react";

export type FaceKey =
  | "design"
  | "front"
  | "back"
  | "quality"
  | "deploy"
  | "suivi";
export type FacePosition =
  | "front"
  | "back"
  | "right"
  | "left"
  | "top"
  | "bottom";

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
        Maquettes, identité visuelle, direction artistique : votre produit a une{" "}
        <strong>vraie personnalité</strong> avant même la première ligne de
        code.
      </>
    ),
  },
  front: {
    num: 2,
    title: "front",
    skills: ["React", "React Native · Expo", "TypeScript"],
    ex: (
      <>
        L&apos;interface que vos utilisateurs voient et touchent : site web ou
        app mobile, <strong>rapide, fluide et soignée</strong> sur tous les
        écrans.
      </>
    ),
  },
  back: {
    num: 3,
    title: "back",
    skills: ["Node.js", "REST · Socket.IO", "MongoDB"],
    ex: (
      <>
        Le moteur invisible : la logique métier, les données et le temps réel
        qui font tourner votre produit <strong>de manière fiable</strong>.
      </>
    ),
  },
  quality: {
    num: 4,
    title: "tests & sécu",
    skills: ["Vitest", "HTTPS · fail2ban", "Perf", "Accessibilité"],
    ex: (
      <>
        Je <strong>teste</strong> ce que je livre et je{" "}
        <strong>sécurise</strong> ce que je déploie : votre produit résiste aux
        bugs comme aux attaques.
      </>
    ),
  },
  suivi: {
    num: 6,
    title: "suivi",
    skills: ["Maintenance", "Évolutions", "Monitoring"],
    ex: (
      <>
        Je ne disparais pas après la livraison : corrections, évolutions et
        surveillance en continu, pour que votre produit{" "}
        <strong>reste en forme dans la durée</strong>.
      </>
    ),
  },
  deploy: {
    num: 5,
    title: "deploy",
    skills: ["Docker", "Traefik", "VPS", "CI"],
    ex: (
      <>
        La mise en ligne de A à Z : serveur, domaine, HTTPS, sauvegardes, votre
        produit <strong>accessible au monde, en production</strong>.
      </>
    ),
  },
};

/** Position géométrique de chaque face sur le cube. */
export const FACE_LAYOUT: { position: FacePosition; key: FaceKey }[] = [
  { position: "front", key: "design" },
  { position: "right", key: "front" },
  { position: "top", key: "back" },
  { position: "left", key: "quality" },
  { position: "bottom", key: "suivi" },
  { position: "back", key: "deploy" },
];

/** Ordre des faces — le cycle complet d'un projet : boutons de navigation
    du cube et pastilles des projets suivent cet ordre. */
export const FACE_ORDER: FaceKey[] = [
  "design",
  "front",
  "back",
  "quality",
  "deploy",
  "suivi",
];

/** Orientation [rotX, rotY] qui présente chaque face à la caméra. */
export const ORIENT: Record<FaceKey, [number, number]> = {
  design: [-10, 16],
  front: [-10, -74],
  quality: [-10, 106],
  deploy: [-10, 196],
  back: [-80, 16],
  suivi: [80, 16],
};
