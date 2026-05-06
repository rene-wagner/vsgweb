const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiErrorResponse = {
  error?: string;
  message?: string;
  detail?: string;
};

export type MembershipApplicationPayload = {
  department: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  otherClub: string;
  bankName: string;
  iban: string;
  bic: string;
  accountHolder: string;
  place: string;
  applicationDate: string;
  legalGuardianName: string;
  acceptsStatutes: boolean;
  acceptsEmailInvitation: boolean;
  acceptsPrivacyPolicy: boolean;
  confirmsMinorAttachment: boolean;
};

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("json")) {
    return fallback;
  }

  try {
    const data = (await response.json()) as ApiErrorResponse;
    return data.error ?? data.message ?? data.detail ?? fallback;
  } catch {
    return fallback;
  }
}

export async function submitMembershipApplication(
  payload: MembershipApplicationPayload,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/membership-application`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 400) {
    throw new Error(await readErrorMessage(response, "Die Anfrage konnte nicht verarbeitet werden."));
  }

  if (response.status === 429) {
    throw new Error("Zu viele Anfragen. Bitte versuche es spaeter erneut.");
  }

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "Der Aufnahmeantrag konnte nicht versendet werden."),
    );
  }
}
