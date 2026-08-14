import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Vul je volledige naam in.")
    .max(100, "Naam is te lang."),
  email: z
    .string()
    .trim()
    .min(1, "Vul je e-mailadres in.")
    .email("Vul een geldig e-mailadres in."),
  company: z
    .string()
    .trim()
    .max(120, "Bedrijfsnaam is te lang.")
    .optional()
    .or(z.literal("")),
  budget: z
    .string()
    .trim()
    .max(60, "Ongeldige waarde.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Vertel iets meer, minimaal 20 tekens.")
    .max(3000, "Bericht is te lang, houd het onder de 3000 tekens."),
  // Honeypot field: real visitors never fill this in because it is hidden
  // from view. Deliberately unrestricted here — the route handler checks
  // it and returns a fake success for spam, so a bot filling it in must
  // still pass validation to reach that check instead of getting a
  // distinguishing 400 that would give the honeypot away.
  website: z.string().max(200).optional().or(z.literal("")),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
