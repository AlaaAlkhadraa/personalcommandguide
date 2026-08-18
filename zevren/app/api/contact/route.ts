import { NextResponse, type NextRequest } from "next/server";
import { createContactSubmission } from "@/lib/contact-submissions";
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
      { message: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid request." },
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
      { message: "Please check the fields below.", fieldErrors: flatErrors },
      { status: 400 }
    );
  }

  // Honeypot triggered: silently report success so bots don't learn to
  // adapt, without actually processing the submission.
  if (result.data.website) {
    return NextResponse.json({ message: "Message sent." }, { status: 200 });
  }

  const { name, email, company, needs, budget } = result.data;

  // TODO(resend): send the notification email once RESEND_API_KEY is
  // configured. Example:
  //
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({
  //     from: "ZEVREN website <noreply@zevren.nl>",
  //     to: process.env.CONTACT_INBOX_EMAIL!,
  //     replyTo: email,
  //     subject: `New enquiry from ${name}`,
  //     text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "-"}\nNeeds: ${needs || "-"}\nBudget: ${budget || "-"}\n\n${result.data.message}`,
  //   });
  //
  try {
    const submissionId = await createContactSubmission({
      name,
      email,
      company: company ?? "",
      needs: needs ?? "",
      budget: budget ?? "",
      message: result.data.message,
      ipAddress: ip,
      userAgent: request.headers.get("user-agent"),
    });
    console.info("[contact] submission saved", { submissionId });
  } catch (error) {
    console.error("[contact] unable to save submission", error);
    return NextResponse.json(
      { message: "We could not send your message. Please try again shortly." },
      { status: 503 }
    );
  }

  return NextResponse.json({ message: "Message sent." }, { status: 200 });
}
