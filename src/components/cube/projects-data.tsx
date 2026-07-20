import type { ReactNode } from "react";
import type { FaceKey } from "./cube-data";

export const ALL_FACES: FaceKey[] = [
  "design",
  "front",
  "back",
  "quality",
  "deploy",
  "suivi",
];

export type Project = {
  num: string;
  title: string;
  desc: ReactNode;
  faces: FaceKey[];
  // face dominante : celle vers laquelle le cube pivote pour ce projet
  lead: FaceKey;
  // couleur du panneau dans la section projets
  variant: "navy" | "burgundy" | "line";
};

export const projects: Project[] = [
  {
    num: "01",
    title: "Freïa Paris",
    desc: (
      <>
        E-commerce d&apos;une marque de sacs artisanaux : front sur mesure et{" "}
        <strong>toute l&apos;infra derrière</strong> — VPS, Traefik, Docker. Un
        vrai site marchand.
      </>
    ),
    faces: ["design", "front", "back", "quality", "deploy", "suivi"],
    lead: "deploy",
    variant: "navy",
  },
  {
    num: "02",
    title: "Alcma",
    desc: (
      <>
        Logiciel de facturation développé <strong>en équipe</strong> pour un
        client : interfaces, API et logique métier, tests et suivi des
        évolutions.
      </>
    ),
    faces: ["front", "back", "quality", "suivi"],
    lead: "back",
    variant: "burgundy",
  },
  {
    num: "03",
    title: "Dernier Mot",
    desc: (
      <>
        Jeu mobile de mots au tour par tour,{" "}
        <strong>multijoueur temps réel</strong>. Conçu, développé et déployé en
        solo — les six faces d&apos;un coup.
      </>
    ),
    faces: ["design", "front", "back", "quality", "deploy", "suivi"],
    lead: "front",
    variant: "line",
  },
];
