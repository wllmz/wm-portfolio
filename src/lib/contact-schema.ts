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
    .email("Cet email n'a pas l'air valide."),
  projectType: z
    .string()
    .refine((v) => (PROJECT_TYPES as readonly string[]).includes(v), {
      message: "Choisissez un type de projet.",
    }),
  message: z
    .string()
    .trim()
    .min(10, "Décrivez votre projet en quelques mots.")
    .max(3000, "3000 caractères maximum."),
  // honeypot anti-spam : doit rester vide, mais on ne le valide pas —
  // sinon le formulaire serait rejeté silencieusement au lieu d'être
  // traité comme un bot par onSubmit et par Formspree (_gotcha).
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
