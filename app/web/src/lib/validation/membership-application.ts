import IBAN from "iban";
import { z } from "zod";
import { mapZodIssuesToFieldErrors } from "@/lib/validation/zod-errors";

export const departmentValues = ["volleyball", "gymnastik", "tischtennis", "badminton"] as const;

export type Department = (typeof departmentValues)[number];

export type MembershipApplicationFormData = {
  department: Department | "";
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  otherClub: string;
  acceptsStatutes: boolean;
  acceptsEmailInvitation: boolean;
  acceptsPrivacyPolicy: boolean;
  place: string;
  applicationDate: string;
  bankName: string;
  iban: string;
  bic: string;
  accountHolder: string;
  isChild: boolean;
  guardianOneName: string;
  guardianOneAddress: string;
  guardianOnePhone: string;
  guardianTwoName: string;
  guardianTwoAddress: string;
  guardianTwoPhone: string;
  underTwelveMayWalkHomeAlone: boolean | null;
  overTwelveMayWalkHomeAlone: boolean | null;
};

export function normalizeIban(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

export function formatIban(value: string): string {
  return (
    normalizeIban(value)
      .match(/.{1,4}/g)
      ?.join(" ") ?? ""
  );
}

export function isValidIban(value: string): boolean {
  const iban = normalizeIban(value);

  return iban.startsWith("DE") && IBAN.isValid(iban);
}

export function isValidBic(value: string): boolean {
  if (!value.trim()) {
    return true;
  }

  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.trim().toUpperCase());
}

export function isValidDate(value: string): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

export function isBirthDatePlausible(value: string): boolean {
  if (!isValidDate(value)) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();
  const earliestYear = today.getFullYear() - 120;

  return date <= today && date.getFullYear() >= earliestYear;
}

export function getAgeFromBirthDate(value: string): number | null {
  if (!isBirthDatePlausible(value)) {
    return null;
  }

  const birthDate = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export function isMinorByBirthDate(value: string): boolean {
  const age = getAgeFromBirthDate(value);

  return age !== null && age < 18;
}

const requiredTrimmedString = (message: string) => z.string().trim().min(1, message);

export const membershipApplicationSchema = z
  .object({
    department: z.enum(departmentValues, {
      error: () => "Bitte wähle eine Abteilung aus.",
    }),
    firstName: requiredTrimmedString("Vorname ist erforderlich."),
    lastName: requiredTrimmedString("Name ist erforderlich."),
    birthDate: requiredTrimmedString("Geburtsdatum ist erforderlich.").refine(
      isBirthDatePlausible,
      {
        message: "Bitte gib ein plausibles Geburtsdatum an.",
      },
    ),
    phone: requiredTrimmedString("Telefon ist erforderlich."),
    email: requiredTrimmedString("Mailadresse ist erforderlich.").refine(
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      { message: "Bitte gib eine gültige Mailadresse ein." },
    ),
    street: requiredTrimmedString("Straße ist erforderlich."),
    postalCode: requiredTrimmedString("PLZ ist erforderlich.").refine(
      (value) => /^\d{5}$/.test(value),
      { message: "Bitte gib eine fünfstellige PLZ an." },
    ),
    city: requiredTrimmedString("Wohnort ist erforderlich."),
    otherClub: z.string(),
    acceptsStatutes: z.literal(true, {
      error: () => "Bitte bestätige Satzung und Beitragsordnung.",
    }),
    acceptsEmailInvitation: z.boolean(),
    acceptsPrivacyPolicy: z.literal(true, {
      error: () => "Bitte erteile die DSGVO-Einwilligung.",
    }),
    place: z.string(),
    applicationDate: z.string().refine((value) => !value || isValidDate(value), {
      message: "Bitte gib ein gültiges Datum an.",
    }),
    bankName: requiredTrimmedString("Kreditinstitut ist erforderlich."),
    iban: requiredTrimmedString("IBAN ist erforderlich.").refine(isValidIban, {
      message: "Bitte gib eine gültige deutsche IBAN ein.",
    }),
    bic: z.string().refine(isValidBic, {
      message: "Bitte gib eine gültige BIC ein oder lasse das Feld leer.",
    }),
    accountHolder: requiredTrimmedString("KontoinhaberIn ist erforderlich."),
    isChild: z.boolean(),
    guardianOneName: z.string(),
    guardianOneAddress: z.string(),
    guardianOnePhone: z.string(),
    guardianTwoName: z.string(),
    guardianTwoAddress: z.string(),
    guardianTwoPhone: z.string(),
    underTwelveMayWalkHomeAlone: z.boolean().nullable(),
    overTwelveMayWalkHomeAlone: z.boolean().nullable(),
  })
  .superRefine((value, ctx) => {
    if (!value.isChild) {
      return;
    }

    if (!value.guardianOneName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardianOneName"],
        message: "Bitte gib mindestens eine erziehungsberechtigte Person an.",
      });
    }

    if (!value.guardianOneAddress.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardianOneAddress"],
        message: "Bitte gib die Anschrift der erziehungsberechtigten Person an.",
      });
    }

    if (!value.guardianOnePhone.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["guardianOnePhone"],
        message: "Bitte gib eine Telefonnummer der erziehungsberechtigten Person an.",
      });
    }

    const age = getAgeFromBirthDate(value.birthDate);

    if (age !== null && age < 12 && value.underTwelveMayWalkHomeAlone === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["underTwelveMayWalkHomeAlone"],
        message: "Bitte wähle aus, ob dein Kind den Heimweg allein antreten darf.",
      });
    }

    if (age !== null && age >= 12 && value.overTwelveMayWalkHomeAlone === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["overTwelveMayWalkHomeAlone"],
        message: "Bitte wähle aus, ob dein Kind den Heimweg allein antreten darf.",
      });
    }
  });

export function validateMembershipApplication(form: MembershipApplicationFormData): {
  success: boolean;
  errors: Record<string, string>;
} {
  const result = membershipApplicationSchema.safeParse(form);

  if (result.success) {
    return { success: true, errors: {} };
  }

  return { success: false, errors: mapZodIssuesToFieldErrors(result.error) };
}
