import { NextResponse, type NextRequest } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";

export const runtime = "nodejs";

// Best-effort in-memory rate limit. This resets on every cold start and is
// not shared across serverless instances — fine as a first line of defense,
// not a substitute for a real rate limiter (e.g. Upstash) in production.
const submissionsByIp = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionsByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  submissionsByIp.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Te veel aanvragen. Probeer het over een minuut opnieuw." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Ongeldige aanvraag." },
      { status: 400 }
    );
  }

  const result = contactFormSchema.safeParse(body);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    const flatErrors: Record<string, string> = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (value?.[0]) flatErrors[key] = value[0];
    }
    return NextResponse.json(
      { message: "Controleer de ingevulde velden.", fieldErrors: flatErrors },
      { status: 400 }
    );
  }

  // Honeypot triggered: silently report success so bots don't learn to
  // adapt, without actually processing the submission.
  if (result.data.website) {
    return NextResponse.json({ message: "Bericht verstuurd." }, { status: 200 });
  }

  const { name, email, company, budget } = result.data;

  // TODO(resend): send the notification email once RESEND_API_KEY is
  // configured. Example:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "ZEVREN website <noreply@zevren.nl>",
  //     to: process.env.CONTACT_INBOX_EMAIL!,
  //     replyTo: email,
  //     subject: `Nieuwe aanvraag van ${name}`,
  //     text: `Naam: ${name}\nE-mail: ${email}\nBedrijf: ${company || "-"}\nBudget: ${budget || "-"}\n\n${message}`,
  //   });
  //
  // Until then, submissions are validated and accepted but not delivered.
  // Log server-side only — never log to a location a client can read.
  console.info("[contact] new submission received", {
    name,
    email,
    company: company || undefined,
    budget: budget || undefined,
  });

  return NextResponse.json({ message: "Bericht verstuurd." }, { status: 200 });
}
