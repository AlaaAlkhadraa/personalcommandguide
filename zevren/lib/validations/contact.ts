import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email address.")
    .email("Please enter a valid email address."),
  company: z
    .string()
    .trim()
    .max(120, "Company name is too long.")
    .optional()
    .or(z.literal("")),
  budget: z
    .string()
    .trim()
    .max(60, "Invalid value.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Please tell us a bit more, at least 20 characters.")
    .max(3000, "Message is too long, keep it under 3000 characters."),
  // Honeypot field: real visitors never fill this in because it is hidden
  // from view. Deliberately unrestricted here — the route handler checks
  // it and returns a fake success for spam, so a bot filling it in must
  // still pass validation to reach that check instead of getting a
  // distinguishing 400 that would give the honeypot away.
  website: z.string().max(200).optional().or(z.literal("")),
});

export type ContactFormSchema = z.infer<typeof contactFormSchema>;
