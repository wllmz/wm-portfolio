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
    .min(2, "Ton prénom, s'il te plaît.")
    .max(60, "60 caractères maximum."),
  lastName: z
    .string()
    .trim()
    .min(2, "Ton nom, s'il te plaît.")
    .max(60, "60 caractères maximum."),
  email: z
    .string()
    .trim()
    .min(1, "L'email est requis.")
    .email("Cet email n'a pas l'air valide."),
  projectType: z
    .string()
    .refine((v) => (PROJECT_TYPES as readonly string[]).includes(v), {
      message: "Choisis un type de projet.",
    }),
  message: z
    .string()
    .trim()
    .min(10, "Décris ton projet en quelques mots.")
    .max(3000, "3000 caractères maximum."),
  // honeypot anti-spam : doit rester vide
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
