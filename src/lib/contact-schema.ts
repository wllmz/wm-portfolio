import { z } from "zod";

export const PROJECT_TYPES = [
  "Site web / Landing",
  "Application web",
  "Application mobile",
  "API / Backend",
  "Refonte / Maintenance",
  "Autre",
] as const;

export const contactSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Votre prénom, s'il vous plaît.")
    .max(60, "60 caractères maximum."),
  lastName: z
    .string()
    .trim()
    .min(2, "Votre nom, s'il vous plaît.")
    .max(60, "60 caractères maximum."),
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis.")
    .pipe(z.email("Cet email n'a pas l'air valide.")),
  // le select part de "" (aucun choix) : chaîne en entrée, type de projet
  // connu en sortie
  projectType: z
    .string()
    .pipe(z.enum(PROJECT_TYPES, { error: "Choisissez un type de projet." })),
  message: z
    .string()
    .trim()
    .min(10, "Décrivez votre projet en quelques mots.")
    .max(3000, "3 000 caractères maximum."),
  // honeypot anti-spam : doit rester vide, mais on ne le valide pas —
  // sinon le formulaire serait rejeté silencieusement au lieu d'être
  // traité comme un bot par onSubmit et par Formspree (_gotcha).
  company: z.string().optional(),
});

/** valeurs du formulaire, telles que saisies */
export type ContactInput = z.input<typeof contactSchema>;
/** valeurs validées, envoyées à Formspree */
export type ContactValues = z.output<typeof contactSchema>;
