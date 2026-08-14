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

export type Shot = {
  src: string;
  alt: string;
  w: number;
  h: number;
  /* la légende dit ce que l'écran fait, pas ce qu'il contient */
  caption: string;
};

export type Project = {
  slug: string;
  num: string;
  title: string;
  /* logotype du client, quand il y en a un : il remplace le titre écrit
     dans le panneau. `title` reste la source pour l'alt et les métadonnées. */
  logo?: { src: string; w: number; h: number };
  desc: ReactNode;
  faces: FaceKey[];
  // face dominante : celle vers laquelle le cube pivote pour ce projet
  lead: FaceKey;

  /* ── page de détail ── */
  tagline: string;
  contexte: string;
  /* ce que j'ai livré, du point de vue de ce que ça fait */
  livre: string[];
  stack: string[];
  shots: Shot[];
  // TODO: ajouter `url` quand les sites sont accessibles publiquement
};

export const projects: Project[] = [
  {
    slug: "freia-paris",
    num: "01",
    title: "Freïa Paris",
    logo: { src: "/projets/freia/logo.png", w: 822, h: 257 },
    desc: (
      <>
        E-commerce d&apos;une marque de sacs artisanaux : front sur mesure et{" "}
        <strong>toute l&apos;infra derrière</strong> : VPS, Traefik, Docker. Un
        vrai site marchand.
      </>
    ),
    faces: ["design", "front", "back", "quality", "deploy", "suivi"],
    lead: "deploy",
    tagline: "La boutique en ligne d'une marque de sacs faits main à Paris.",
    contexte:
      "Freïa fabrique à la main des sacs en paracorde à Paris. La marque vend en direct : il lui fallait une vraie boutique en ligne, avec sa propre identité.",
    livre: [
      "La boutique : collection, fiches produit, panier et commande.",
      "La gestion du stock, affichée en direct sur chaque fiche produit.",
      "La mise en page éditoriale : visuels pleine largeur, bandeau défilant, mise en avant du fait-main.",
      "L'hébergement de bout en bout : serveur, nom de domaine, HTTPS, sauvegardes.",
      "Le suivi après la mise en ligne.",
      "Authentification et autorisations pour l'accès à l'administration.",
      "L'administration : gestion des produits, des stocks et des commandes.",
      "Suivi statistiques et commandes, avec export CSV pour la comptabilité.",
    ],
    stack: ["React", "Node.js", "Docker", "Traefik", "VPS"],
    shots: [
      {
        src: "/projets/freia/accueil.png",
        alt: "Page d'accueil de Freïa Paris, deux visuels lifestyle plein écran",
        w: 1892,
        h: 852,
        caption: "L'accueil, pensé comme une page de magazine.",
      },
      {
        src: "/projets/freia/collection.png",
        alt: "Page collection avec le bandeau Made in France et la gamme Madï",
        w: 1896,
        h: 862,
        caption: "La collection, avec le bandeau défilant fait-main.",
      },
      {
        src: "/projets/freia/produit.png",
        alt: "Fiche produit du sac Madï Kaki avec prix, caractéristiques et ajout au panier",
        w: 1892,
        h: 870,
        caption: "La fiche produit : galerie, caractéristiques, stock réel.",
      },
      {
        src: "/projets/freia/connexion.png",
        alt: "Page de création de compte client Freïa avec prénom, nom, email et mot de passe",
        w: 1890,
        h: 851,
        caption: "Le compte client : connexion, inscription, mot de passe oublié.",
      },
      {
        src: "/projets/freia/panier.png",
        alt: "Panier avec un sac Madï Kaki, quantité et total",
        w: 1896,
        h: 853,
        caption: "Le panier, avant de passer commande.",
      },
      {
        src: "/projets/freia/paiement.png",
        alt: "Tunnel de commande : coordonnées et choix du point relais Mondial Relay",
        w: 1892,
        h: 858,
        caption: "Le tunnel de commande : coordonnées et livraison en point relais.",
      },
      {
        src: "/projets/freia/paiement-carte.png",
        alt: "Paiement par carte bancaire via Stripe",
        w: 1887,
        h: 862,
        caption: "Le paiement par carte, via Stripe.",
      },
      {
        src: "/projets/freia/admin-dashboard.png",
        alt: "Back-office Freïa : tableau de bord avec stock, commandes et chiffre d'affaires",
        w: 1887,
        h: 845,
        caption: "Le back-office : vue d'ensemble du stock, des commandes et du chiffre d'affaires.",
      },
      {
        src: "/projets/freia/admin-produits.png",
        alt: "Back-office Freïa : gestion du catalogue produits, stock et statuts",
        w: 1900,
        h: 860,
        caption: "La gestion du catalogue : produits, stock, statuts.",
      },
    ],
  },
  {
    slug: "alcma",
    num: "02",
    title: "Alcma",
    logo: { src: "/projets/alcma/logo.png", w: 1035, h: 224 },
    desc: (
      <>
        Logiciel de facturation développé <strong>en équipe</strong> pour un
        client : interfaces, API et logique métier, tests et suivi des
        évolutions.
      </>
    ),
    faces: ["front", "back", "quality", "suivi"],
    lead: "back",
    tagline:
      "Un logiciel de facturation en SaaS, vendu en licence à des entreprises.",
    contexte:
      "Alcma n'est pas un outil de facturation pour une seule société : chaque entreprise cliente a son espace, ses utilisateurs et son quota. Un back-office permet de gérer les licences vendues et de suivre l'ensemble des comptes. J'ai travaillé dessus en équipe.",
    livre: [
      "Les écrans de facturation : devis et factures, statuts, échéances, montants HT et TTC.",
      "Le tableau de bord de trésorerie : revenus, dépenses, résultat après impôts, charges.",
      "Le back-office : licences et formules, quotas, modules activables, entreprises rattachées.",
      "Les tests sur ce que j'ai livré, et le suivi des évolutions.",
    ],
    stack: ["React", "TypeScript", "Node.js"],
    shots: [
      {
        src: "/projets/alcma/dashboard.png",
        alt: "Tableau de bord de trésorerie avec courbes de revenus et dépenses",
        w: 1787,
        h: 1077,
        caption: "La trésorerie en un coup d'œil.",
      },
      {
        src: "/projets/alcma/facturation.png",
        alt: "Liste des factures avec statuts, échéances et montants",
        w: 1795,
        h: 1040,
        caption: "Devis et factures, filtrables par statut.",
      },
      {
        src: "/projets/alcma/super-admin.png",
        alt: "Accueil du back-office super admin",
        w: 1798,
        h: 922,
        caption: "Le back-office qui pilote les licences vendues.",
      },
      {
        src: "/projets/alcma/licences.png",
        alt: "Liste des formules de licence Starter, Basic et Premium",
        w: 1787,
        h: 1068,
        caption: "Les formules et ce que chacune ouvre.",
      },
      {
        src: "/projets/alcma/entreprises-liees.png",
        alt: "Entreprises rattachées à une licence avec leur statut",
        w: 1785,
        h: 1077,
        caption: "Les entreprises rattachées à une licence.",
      },
    ],
  },
  {
    slug: "dernier-mot",
    num: "03",
    title: "Dernier Mot",
    desc: (
      <>
        Jeu mobile de mots au tour par tour,{" "}
        <strong>multijoueur temps réel</strong>. Conçu, développé et déployé en
        solo, les six faces d&apos;un coup.
      </>
    ),
    faces: ["design", "front", "back", "quality", "deploy", "suivi"],
    lead: "front",
    tagline: "Un jeu de mots multijoueur en temps réel, sur mobile.",
    contexte:
      "Projet mené seul, de l'idée à la mise en ligne : c'est le seul des trois où j'ai couvert les six faces sans personne d'autre.",
    livre: [
      "Le jeu : parties au tour par tour, de 2 à 8 joueurs, sur un seul téléphone ou en ligne.",
      "Le temps réel : chaque coup arrive chez l'adversaire sans rechargement.",
      "Les rooms en ligne : un code à partager, les joueurs qui rejoignent et l'état de la connexion en direct.",
      "Deux modes de jeu, chacun avec ses réglages : classique au chrono, et time-bomb à mèche cachée.",
      "Le catalogue de questions : univers, sous-thèmes et banques de réponses.",
      "Les achats intégrés : boutique, déblocage définitif des sous-thèmes et restauration des achats.",
      "L'identité visuelle et les écrans de l'application.",
      "La mise en ligne et le suivi.",
    ],
    stack: ["React Native", "Expo", "Node.js", "Socket.io"],
    shots: [
      {
        src: "/projets/dernier-mot/accueil.jpeg",
        alt: "Écran d'accueil de Dernier Mot avec les boutons Jouer ici, Room et Rejoindre",
        w: 739,
        h: 1600,
        caption: "L'accueil : jouer sur un seul téléphone, ou créer et rejoindre une partie en ligne.",
      },
      {
        src: "/projets/dernier-mot/themes.jpeg",
        alt: "Choix de l'univers : séries, films, foot, pays",
        w: 739,
        h: 1600,
        caption: "Le choix de l'univers sur lequel s'affronter.",
      },
      {
        src: "/projets/dernier-mot/sous-themes.jpeg",
        alt: "Sous-thèmes du thème Pays, certains gratuits, d'autres verrouillés",
        w: 739,
        h: 1600,
        caption: "Les sous-thèmes, gratuits ou à débloquer, avec leur nombre de réponses.",
      },
      {
        src: "/projets/dernier-mot/boutique.jpeg",
        alt: "Boutique de l'application : déblocage des 34 sous-thèmes pour 4,99 € et restauration des achats",
        w: 946,
        h: 2048,
        caption: "La boutique : un achat unique, sans abonnement ni pub, restaurable sur tous les appareils.",
      },
      {
        src: "/projets/dernier-mot/player-choose.jpeg",
        alt: "Ajout d'un joueur : saisie du prénom et choix d'un avatar",
        w: 739,
        h: 1600,
        caption: "Les joueurs : de 2 à 8, chacun son prénom et sa tête.",
      },
      {
        src: "/projets/dernier-mot/game-set.jpeg",
        alt: "Réglages de la partie en mode classique : chrono, vies, mode secret, mort subite",
        w: 739,
        h: 1600,
        caption: "Les réglages : chrono par tour, vies, mode secret, mort subite.",
      },
      {
        src: "/projets/dernier-mot/regles.jpeg",
        alt: "Écran expliquant comment on joue en trois étapes",
        w: 739,
        h: 1600,
        caption: "Les règles rappelées avant de lancer, adaptées aux options choisies.",
      },
      {
        src: "/projets/dernier-mot/player.jpeg",
        alt: "Écran de passage de tour orange : à toi, Will",
        w: 739,
        h: 1600,
        caption: "Le passage de tour, quand on se passe le téléphone.",
      },
      {
        src: "/projets/dernier-mot/game.jpeg",
        alt: "Manche en cours en mort subite : compte à rebours, vies et saisie de la réponse",
        w: 739,
        h: 1600,
        caption: "La manche : compte à rebours, vies restantes, réponse au clavier.",
      },
      {
        src: "/projets/dernier-mot/time-bombe-set.jpeg",
        alt: "Réglages du mode Time-bomb : longueur de mèche, tic-tac audible, vibration",
        w: 739,
        h: 1600,
        caption: "Le mode time-bomb et ses propres réglages : mèche, son, vibration.",
      },
      {
        src: "/projets/dernier-mot/time-bombe.jpeg",
        alt: "Manche en mode Time-bomb avec la bombe allumée et le message Passe vite",
        w: 739,
        h: 1600,
        caption: "En time-bomb, personne ne sait quand ça explose : celui qui tient le téléphone paie.",
      },
      {
        src: "/projets/dernier-mot/room.jpeg",
        alt: "Room créée avec son code à partager et l'état de la connexion",
        w: 739,
        h: 1600,
        caption: "La room en ligne : un code à dicter, l'état de la connexion en direct.",
      },
      {
        src: "/projets/dernier-mot/join-room.jpeg",
        alt: "Écran pour rejoindre une room : saisie du code et du pseudo",
        w: 739,
        h: 1600,
        caption: "Rejoindre : le code, un pseudo, et c'est parti.",
      },
    ],
  },
];
