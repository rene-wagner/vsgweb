const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EMBED_TOKEN_QUERY_PARAM = "embed_token";
const EMBED_VERIFY_PATH = "/api/embed/verify";

interface EditingModeVerificationResponse {
  editingMode: boolean;
}

export function getConfiguredApiOrigin(): string | null {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return null;
  }
}

export function isEmbeddedInIframe(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function hasAllowedReferrer(): boolean {
  if (typeof document === "undefined" || document.referrer.length === 0) {
    return false;
  }

  const configuredOrigin = getConfiguredApiOrigin();

  if (configuredOrigin === null) {
    return false;
  }

  try {
    return new URL(document.referrer).origin === configuredOrigin;
  } catch {
    return false;
  }
}

export function readEmbedTokenFromUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = new URL(window.location.href).searchParams.get(EMBED_TOKEN_QUERY_PARAM);
  const normalizedToken = token?.trim();

  return normalizedToken && normalizedToken.length > 0 ? normalizedToken : null;
}

export function removeEmbedTokenFromUrl(): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);

  if (!url.searchParams.has(EMBED_TOKEN_QUERY_PARAM)) {
    return;
  }

  url.searchParams.delete(EMBED_TOKEN_QUERY_PARAM);
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;

  try {
    window.history.replaceState(window.history.state, "", nextUrl);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[VSG] Failed to remove embed token from URL", error);
    }
  }
}

function getEmbedVerificationUrl(): string | null {
  try {
    return new URL(EMBED_VERIFY_PATH, API_BASE_URL).toString();
  } catch {
    return null;
  }
}

function isEditingModeVerificationResponse(
  value: unknown,
): value is EditingModeVerificationResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "editingMode" in value &&
    typeof value.editingMode === "boolean"
  );
}

export async function verifyEditingMode(embedToken: string): Promise<boolean> {
  const verificationUrl = getEmbedVerificationUrl();

  if (verificationUrl === null) {
    return false;
  }

  const response = await fetch(verificationUrl, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ embed_token: embedToken }),
  });

  if (!response.ok) {
    return false;
  }

  const payload: unknown = await response.json();
  return isEditingModeVerificationResponse(payload) ? payload.editingMode : false;
}
