import { readonly, ref } from "vue";
import {
  hasAllowedReferrer,
  isEmbeddedInIframe,
  readEmbedTokenFromUrl,
  removeEmbedTokenFromUrl,
  verifyEditingMode,
} from "@/lib/editing-mode";

const isEditingMode = ref(false);
const isCheckingEditingMode = ref(true);

let verificationPromise: Promise<void> | null = null;

async function initializeEditingMode(): Promise<void> {
  if (!isEmbeddedInIframe() || !hasAllowedReferrer()) {
    console.log('E');
    isEditingMode.value = false;
    isCheckingEditingMode.value = false;
    return;
  }

  const embedToken = readEmbedTokenFromUrl();
  removeEmbedTokenFromUrl();

  if (embedToken === null) {
    isEditingMode.value = false;
    isCheckingEditingMode.value = false;
    return;
  }

  try {
    isEditingMode.value = await verifyEditingMode(embedToken);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("[VSG] Editing mode verification failed unexpectedly", error);
    }

    isEditingMode.value = false;
  } finally {
    isCheckingEditingMode.value = false;
  }
}

export function useEditingMode() {
  console.log('A');
  verificationPromise ??= initializeEditingMode();

  return {
    isEditingMode: readonly(isEditingMode),
    isCheckingEditingMode: readonly(isCheckingEditingMode),
  };
}
