"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  PROJECT_TYPES,
  type ContactInput,
} from "@/lib/contact-schema";

// Endpoint Formspree (formspree.io > ton formulaire > Integration).
// Cet identifiant est public par nature : il apparaît dans le HTML du site déployé.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvkpqboz";

type Status = "idle" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { projectType: "" },
  });

  async function onSubmit(data: ContactInput) {
    setStatus("idle");

    // honeypot rempli -> bot : on simule un succès sans rien envoyer
    if (data.company) {
      reset();
      setStatus("success");
      return;
    }

    const fullName = `${data.firstName} ${data.lastName}`;

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({
          name: fullName,
          email: data.email,
          "Type de projet": data.projectType,
          message: data.message,
          _subject: `Nouveau projet (${data.projectType}) · ${fullName}`,
          _replyto: data.email,
          _gotcha: data.company ?? "",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        console.error("[contact] formspree", res.status, body);
        throw new Error("send failed");
      }
      reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="cform">
      {/* appât anti-spam, hors écran */}
      <div className="cform-hp" aria-hidden="true">
        <label htmlFor="company">Société</label>
        <input
          id="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("company")}
        />
      </div>

      <div className="cform-row">
        <div className="cfield">
          <label htmlFor="firstName">Prénom</label>
          <input
            id="firstName"
            type="text"
            placeholder="William"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="cfield-error">{errors.firstName.message}</p>
          )}
        </div>

        <div className="cfield">
          <label htmlFor="lastName">Nom</label>
          <input
            id="lastName"
            type="text"
            placeholder="Martinez"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="cfield-error">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="cfield">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="cfield-error">{errors.email.message}</p>}
      </div>

      <div className="cfield">
        <label htmlFor="projectType">Type de projet</label>
        <select
          id="projectType"
          aria-invalid={!!errors.projectType}
          defaultValue=""
          {...register("projectType")}
        >
          <option value="" disabled>
            Sélectionne…
          </option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <p className="cfield-error">{errors.projectType.message}</p>
        )}
      </div>

      <div className="cfield">
        <label htmlFor="message">Détails de votre projet</label>
        <textarea
          id="message"
          rows={4}
          placeholder="Votre besoin, votre échéance, votre budget indicatif…"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="cfield-error">{errors.message.message}</p>
        )}
      </div>

      <div className="cform-foot">
        <button type="submit" disabled={isSubmitting} className="cform-submit">
          {isSubmitting ? "Envoi…" : "Envoyer le message"}
        </button>

        <p aria-live="polite" className="cform-status">
          {status === "success" &&
            "Message envoyé, merci ! Je vous réponds sous 24 h."}
          {status === "error" && (
            <>
              L&apos;envoi a échoué. Réessayez ou écrivez-moi à{" "}
              <a href="mailto:william.martinez06500@gmail.com">
                william.martinez06500@gmail.com
              </a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
