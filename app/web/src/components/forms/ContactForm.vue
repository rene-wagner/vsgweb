<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed, reactive, ref } from "vue";
import { isContactFormValid, validateContactForm } from "@/lib/validation/contact-form";

const props = defineProps<{
  contactPersonId: number;
  contactPersonName: string;
}>();

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiErrorResponse = {
  error?: string;
  message?: string;
  detail?: string;
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

const form = reactive({
  senderName: "",
  senderEmail: "",
  subject: "",
  message: "",
  website: "",
});

// UI state
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref<string | null>(null);

// Validation state
const errors = ref<Record<string, string>>({});

const validateForm = (): boolean => {
  const validationResult = validateContactForm(form);
  errors.value = validationResult.errors;
  return validationResult.success;
};

const isFormValid = computed(() => {
  return isContactFormValid(form);
});

// Submit handler
const submitForm = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  submitError.value = null;

  try {
    const csrfResponse = await fetch(`${API_BASE_URL}/api/contact-form/csrf-token`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    if (!csrfResponse.ok) {
      submitError.value = await readErrorMessage(
        csrfResponse,
        "CSRF-Token konnte nicht geladen werden.",
      );
      return;
    }

    const { token } = (await csrfResponse.json()) as { token?: string };

    if (!token) {
      submitError.value = "CSRF-Token konnte nicht geladen werden.";
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        contactPersonId: props.contactPersonId,
        senderName: form.senderName.trim(),
        senderEmail: form.senderEmail.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        website: form.website, // Honeypot
        csrfToken: token,
      }),
    });

    if (response.status === 403) {
      submitError.value = await readErrorMessage(response, "CSRF-Token fehlt oder ist ungültig.");
      return;
    }

    if (response.status === 429) {
      submitError.value = "Zu viele Anfragen. Bitte versuche es später erneut.";
      return;
    }

    if (!response.ok) {
      submitError.value = await readErrorMessage(
        response,
        "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
      );
      return;
    }

    // Success!
    submitSuccess.value = true;

    // Reset form
    form.senderName = "";
    form.senderEmail = "";
    form.subject = "";
    form.message = "";
    form.website = "";
  } catch (_e) {
    submitError.value =
      "Ein Netzwerkfehler ist aufgetreten. Bitte überprüfe deine Internetverbindung.";
  } finally {
    isSubmitting.value = false;
  }
};

// Clear success message to allow new submission
const clearSuccess = () => {
  submitSuccess.value = false;
};
</script>

<template>
  <div class="mt-8 bg-white border border-vsg-blue-100 p-8">
    <h3 class="font-display text-xl tracking-wider text-vsg-blue-900 mb-6">
      Nachricht an {{ contactPersonName }}
    </h3>

    <!-- Success Message -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="submitSuccess"
        class="mb-6 p-4 bg-green-50 border border-green-200"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-start gap-3">
          <FontAwesomeIcon icon="check" class="text-green-600 mt-0.5 shrink-0" />
          <div class="flex-1">
            <p class="font-body text-green-800">
              Deine Nachricht wurde erfolgreich gesendet. Vielen Dank für deine Anfrage!
            </p>
            <button
              class="mt-2 rounded-md text-sm text-green-700 hover:text-green-900 underline font-body"
              @click="clearSuccess"
            >
              Weitere Nachricht senden
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Error Message -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="submitError"
        class="mb-6 p-4 bg-red-50 border border-red-200"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-start gap-3">
          <FontAwesomeIcon icon="exclamation-triangle" class="text-red-600 mt-0.5 shrink-0" />
          <p class="font-body text-red-800">{{ submitError }}</p>
        </div>
      </div>
    </Transition>

    <!-- Form -->
    <form v-if="!submitSuccess" class="space-y-5" @submit.prevent="submitForm">
      <div class="absolute" style="left: -9999px; position: absolute" aria-hidden="true">
        <label for="website">Website (Leave this field blank)</label>
        <input
          id="website"
          v-model="form.website"
          type="text"
          name="website"
          tabindex="-1"
          autocomplete="off"
        />
      </div>
      <!-- Name Field -->
      <div>
        <label
          for="senderName"
          class="block font-body font-normal text-sm tracking-wider text-vsg-blue-600 uppercase mb-2"
        >
          Dein Name *
        </label>
        <input
          id="senderName"
          v-model="form.senderName"
          type="text"
          required
          maxlength="100"
          :disabled="isSubmitting"
          :class="[
            'w-full rounded-md px-4 py-3 bg-white border-2 font-body text-vsg-blue-900 transition-colors',
            'focus:outline-none focus:border-vsg-gold-400',
            errors.senderName ? 'border-red-300' : 'border-vsg-blue-200',
            isSubmitting ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          placeholder="Max Mustermann"
        />
        <p v-if="errors.senderName" class="mt-1 text-sm text-red-600 font-body">
          {{ errors.senderName }}
        </p>
      </div>

      <!-- Email Field -->
      <div>
        <label
          for="senderEmail"
          class="block font-body font-normal text-sm tracking-wider text-vsg-blue-600 uppercase mb-2"
        >
          Deine E-Mail *
        </label>
        <input
          id="senderEmail"
          v-model="form.senderEmail"
          type="email"
          required
          :disabled="isSubmitting"
          :class="[
            'w-full rounded-md px-4 py-3 bg-white border-2 font-body text-vsg-blue-900 transition-colors',
            'focus:outline-none focus:border-vsg-gold-400',
            errors.senderEmail ? 'border-red-300' : 'border-vsg-blue-200',
            isSubmitting ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          placeholder="max@beispiel.de"
        />
        <p v-if="errors.senderEmail" class="mt-1 text-sm text-red-600 font-body">
          {{ errors.senderEmail }}
        </p>
      </div>

      <!-- Subject Field -->
      <div>
        <label
          for="subject"
          class="block font-body font-normal text-sm tracking-wider text-vsg-blue-600 uppercase mb-2"
        >
          Betreff *
        </label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          required
          maxlength="200"
          :disabled="isSubmitting"
          :class="[
            'w-full rounded-md px-4 py-3 bg-white border-2 font-body text-vsg-blue-900 transition-colors',
            'focus:outline-none focus:border-vsg-gold-400',
            errors.subject ? 'border-red-300' : 'border-vsg-blue-200',
            isSubmitting ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          placeholder="Deine Anfrage"
        />
        <p v-if="errors.subject" class="mt-1 text-sm text-red-600 font-body">
          {{ errors.subject }}
        </p>
      </div>

      <!-- Message Field -->
      <div>
        <label
          for="message"
          class="block font-body font-normal text-sm tracking-wider text-vsg-blue-600 uppercase mb-2"
        >
          Nachricht *
        </label>
        <textarea
          id="message"
          v-model="form.message"
          required
          rows="5"
          maxlength="5000"
          :disabled="isSubmitting"
          :class="[
            'w-full rounded-md px-4 py-3 bg-white border-2 font-body text-vsg-blue-900 transition-colors resize-y min-h-30',
            'focus:outline-none focus:border-vsg-gold-400',
            errors.message ? 'border-red-300' : 'border-vsg-blue-200',
            isSubmitting ? 'opacity-50 cursor-not-allowed' : '',
          ]"
          placeholder="Deine Nachricht..."
        ></textarea>
        <p v-if="errors.message" class="mt-1 text-sm text-red-600 font-body">
          {{ errors.message }}
        </p>
        <p class="mt-1 text-xs text-vsg-blue-400 font-body">
          {{ form.message.length }} / 5000 Zeichen
        </p>
      </div>

      <!-- Submit Button -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="!isFormValid || isSubmitting"
          :class="[
            'w-full rounded-md px-6 py-3 font-body font-medium text-lg transition-all',
            isFormValid && !isSubmitting
              ? 'bg-vsg-gold-400 text-vsg-blue-900 hover:bg-vsg-gold-500 cursor-pointer'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed',
          ]"
        >
          <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
            <FontAwesomeIcon icon="spinner" spin />
            Wird gesendet...
          </span>
          <span v-else>Nachricht senden</span>
        </button>
      </div>

      <p class="text-xs text-vsg-blue-400 font-body text-center">* Pflichtfelder</p>
    </form>
  </div>
</template>
