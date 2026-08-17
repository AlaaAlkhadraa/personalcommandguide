import { z } from "zod";

import { contactFormSchema } from "@/lib/validations/contact";

/**
 * Wire format for the two public write endpoints.
 *
 * `.strict()` matters here: any field the client invents is rejected instead
 * of being carried along, so no request can set `status`, `id` or anything
 * else the database owns. Everything that reaches the database has passed
 * through this schema, on the server, regardless of what the browser did.
 */

const NEEDS = [
  "",
  "new-website",
  "redesign",
  "online-store",
  "web-application",
  "maintenance",
  "not-sure",
] as const;

const BUDGET = ["", "under-800", "800-1.5k", "1.5k-3k", "3k-plus", "not-sure"] as const;

/** Rejects control characters that have no place in a name or company field. */
const noControlChars = (value: string) => !/[\u0000-\u001F\u007F]/.test(value);

export const submissionSchema = contactFormSchema
  .extend({
    // Constrained to the exact option values the form renders. A hand-crafted
    // request cannot store arbitrary text in these columns.
    needs: z.enum(NEEDS).optional().default(""),
    budget: z.enum(BUDGET).optional().default(""),
    name: contactFormSchema.shape.name.refine(noControlChars, "Invalid value."),
    company: z
      .string()
      .trim()
      .max(120, "Company name is too long.")
      .refine(noControlChars, "Invalid value.")
      .optional()
      .or(z.literal("")),
    locale: z.enum(["en", "nl", "de", "fr", "es", "ar"]).optional(),
    csrfToken: z.string().max(200).optional(),
    /**
     * Milliseconds between the form rendering and the submit. A real visitor
     * needs seconds to type a 20+ character message; a script posts instantly.
     * A heuristic, not a control: it is one signal alongside the honeypot,
     * the rate limiter and duplicate detection, and it is never the only thing
     * standing between an attacker and the database.
     */
    elapsedMs: z.coerce.number().int().min(0).max(1000 * 60 * 60 * 24).optional(),
  })
  .strict();

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const MIN_FILL_MS = 1500;

/** Field-level errors, flattened to one message per field for the UI. */
export function flattenFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(error.flatten().fieldErrors)) {
    const first = messages?.[0];
    if (first) out[key] = first;
  }
  return out;
}
