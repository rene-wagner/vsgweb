import { computed } from "vue";

function isEmbeddedOnConfiguredOrigin(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  let isEmbedded = false;

  try {
    isEmbedded = window.self !== window.top;
  } catch {
    isEmbedded = true;
  }

  if (!isEmbedded || document.referrer.length === 0) {
    return false;
  }

  try {
    const configuredOrigin = new URL(import.meta.env.VITE_API_BASE_URL).origin;
    const referrerOrigin = new URL(document.referrer).origin;
    return referrerOrigin === configuredOrigin;
  } catch {
    return false;
  }
}

export function useEditingMode() {
  const isEditingMode = computed(() => isEmbeddedOnConfiguredOrigin());

  return {
    isEditingMode,
  };
}
