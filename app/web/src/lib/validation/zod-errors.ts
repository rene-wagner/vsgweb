import type { ZodError } from "zod";

export function mapZodIssuesToFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const [field] = issue.path;

    if (typeof field !== "string" || fieldErrors[field]) {
      continue;
    }

    fieldErrors[field] = issue.message;
  }

  return fieldErrors;
}
