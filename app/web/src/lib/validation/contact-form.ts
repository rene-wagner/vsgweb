import { z } from "zod";
import { mapZodIssuesToFieldErrors } from "@/lib/validation/zod-errors";

export type ContactFormData = {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  website: string;
};

const contactFormSchema = z.object({
  senderName: z
    .string()
    .trim()
    .min(1, "Name ist erforderlich")
    .min(2, "Name muss mindestens 2 Zeichen haben")
    .max(100, "Name darf maximal 100 Zeichen haben"),
  senderEmail: z
    .string()
    .trim()
    .min(1, "E-Mail ist erforderlich")
    .email("Bitte gib eine gültige E-Mail-Adresse ein"),
  subject: z
    .string()
    .trim()
    .min(1, "Betreff ist erforderlich")
    .min(5, "Betreff muss mindestens 5 Zeichen haben")
    .max(200, "Betreff darf maximal 200 Zeichen haben"),
  message: z
    .string()
    .trim()
    .min(1, "Nachricht ist erforderlich")
    .min(10, "Nachricht muss mindestens 10 Zeichen haben")
    .max(5000, "Nachricht darf maximal 5000 Zeichen haben"),
  website: z.string().trim().max(0, "Ungültige Anfrage"),
});

export function validateContactForm(form: ContactFormData): {
  success: boolean;
  errors: Record<string, string>;
} {
  const result = contactFormSchema.safeParse(form);

  if (result.success) {
    return { success: true, errors: {} };
  }

  return {
    success: false,
    errors: mapZodIssuesToFieldErrors(result.error),
  };
}

export function isContactFormValid(form: ContactFormData): boolean {
  return contactFormSchema.safeParse(form).success;
}
