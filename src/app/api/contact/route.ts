import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

const TO_EMAIL = "william.martinez06500@gmail.com";
// Domaine non vérifié -> on utilise l'expéditeur de test Resend.
// Une fois ton domaine vérifié, remplace par une adresse @tondomaine.
const FROM_EMAIL = "Portfolio <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Configuration serveur manquante." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, projectType, message, company } =
    parsed.data;

  // honeypot rempli -> bot : on répond OK sans envoyer
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const fullName = `${firstName} ${lastName}`;
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `Nouveau projet (${projectType}) · ${fullName}`,
    html: `
      <div style="font-family:system-ui,sans-serif;line-height:1.6;color:#232b4e">
        <h2 style="margin:0 0 12px">Nouveau message via le portfolio</h2>
        <p><strong>Nom :</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Type de projet :</strong> ${escapeHtml(projectType)}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `,
    text: `Nouveau message via le portfolio\n\nNom : ${fullName}\nEmail : ${email}\nType de projet : ${projectType}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessaie ou écris-moi directement." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
