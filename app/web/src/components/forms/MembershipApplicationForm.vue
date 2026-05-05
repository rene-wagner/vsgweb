<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

type Department = "volleyball" | "gymnastik" | "tischtennis" | "badminton";

type FormState = {
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

const PDF_APPLICATION_URL = `${import.meta.env.VITE_API_BASE_URL}/media/20-aufnahmeantrag2018-pdf.pdf`;

const departmentOptions: Array<{
  label: string;
  value: Department;
  accentClass: string;
  backgroundClass: string;
}> = [
  {
    label: "Badminton",
    value: "badminton",
    accentClass: "border-vsg-badminton-primary",
    backgroundClass: "bg-vsg-badminton-secondary",
  },
  {
    label: "Gymnastik",
    value: "gymnastik",
    accentClass: "border-vsg-gymnastik-primary",
    backgroundClass: "bg-vsg-gymnastik-secondary",
  },
  {
    label: "Tischtennis",
    value: "tischtennis",
    accentClass: "border-vsg-tischtennis-primary",
    backgroundClass: "bg-vsg-tischtennis-secondary",
  },
  {
    label: "Volleyball",
    value: "volleyball",
    accentClass: "border-vsg-volleyball-primary",
    backgroundClass: "bg-vsg-volleyball-secondary",
  },
];

const form = reactive<FormState>({
  department: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  phone: "",
  email: "",
  street: "",
  postalCode: "",
  city: "",
  otherClub: "",
  bankName: "",
  iban: "",
  bic: "",
  accountHolder: "",
  place: "",
  applicationDate: new Date().toISOString().slice(0, 10),
  legalGuardianName: "",
  acceptsStatutes: false,
  acceptsEmailInvitation: false,
  acceptsPrivacyPolicy: false,
  confirmsMinorAttachment: false,
});

const errors = ref<Record<string, string>>({});
const submitSuccess = ref(false);

const isMinor = computed(() => {
  if (!form.birthDate) {
    return false;
  }

  const birthDate = new Date(form.birthDate);

  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age < 18;
});

function normalizeIban(value: string): string {
  return value.replace(/\s+/g, "").toUpperCase();
}

function formatIban(value: string): string {
  return normalizeIban(value)
    .match(/.{1,4}/g)
    ?.join(" ") ?? "";
}

function isValidGermanPostalCode(value: string): boolean {
  return /^\d{5}$/.test(value.trim());
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidIban(value: string): boolean {
  const iban = normalizeIban(value);

  if (!/^DE\d{20}$/.test(iban)) {
    return false;
  }

  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  const numericRepresentation = rearranged.replace(/[A-Z]/g, (letter) => {
    return String(letter.charCodeAt(0) - 55);
  });

  let remainder = 0;

  for (const digit of numericRepresentation) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}

function isValidBic(value: string): boolean {
  if (!value.trim()) {
    return true;
  }

  return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(value.trim().toUpperCase());
}

function isValidDate(value: string): boolean {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isBirthDatePlausible(value: string): boolean {
  if (!isValidDate(value)) {
    return false;
  }

  const date = new Date(value);
  const today = new Date();
  const earliestYear = today.getFullYear() - 120;

  return date <= today && date.getFullYear() >= earliestYear;
}

function validateForm(): boolean {
  const nextErrors: Record<string, string> = {};

  if (!form.department) nextErrors.department = "Bitte wähle eine Abteilung aus.";
  if (!form.firstName.trim()) nextErrors.firstName = "Vorname ist erforderlich.";
  if (!form.lastName.trim()) nextErrors.lastName = "Name ist erforderlich.";

  if (!form.birthDate) {
    nextErrors.birthDate = "Geburtsdatum ist erforderlich.";
  } else if (!isBirthDatePlausible(form.birthDate)) {
    nextErrors.birthDate = "Bitte gib ein plausibles Geburtsdatum an.";
  }

  if (!form.phone.trim()) nextErrors.phone = "Telefon ist erforderlich.";

  if (!form.email.trim()) {
    nextErrors.email = "Mailadresse ist erforderlich.";
  } else if (!isValidEmail(form.email)) {
    nextErrors.email = "Bitte gib eine gültige Mailadresse ein.";
  }

  if (!form.street.trim()) nextErrors.street = "Straße ist erforderlich.";

  if (!form.postalCode.trim()) {
    nextErrors.postalCode = "PLZ ist erforderlich.";
  } else if (!isValidGermanPostalCode(form.postalCode)) {
    nextErrors.postalCode = "Bitte gib eine fünfstellige PLZ an.";
  }

  if (!form.city.trim()) nextErrors.city = "Wohnort ist erforderlich.";
  if (!form.bankName.trim()) nextErrors.bankName = "Kreditinstitut ist erforderlich.";

  if (!form.iban.trim()) {
    nextErrors.iban = "IBAN ist erforderlich.";
  } else if (!isValidIban(form.iban)) {
    nextErrors.iban = "Bitte gib eine gültige deutsche IBAN ein.";
  }

  if (!isValidBic(form.bic)) {
    nextErrors.bic = "Bitte gib eine gültige BIC ein oder lasse das Feld leer.";
  }

  if (!form.accountHolder.trim()) {
    nextErrors.accountHolder = "KontoinhaberIn ist erforderlich.";
  }

  if (!form.place.trim()) nextErrors.place = "Ort ist erforderlich.";

  if (!form.applicationDate) {
    nextErrors.applicationDate = "Datum ist erforderlich.";
  } else if (!isValidDate(form.applicationDate)) {
    nextErrors.applicationDate = "Bitte gib ein gültiges Datum an.";
  }

  if (isMinor.value && !form.legalGuardianName.trim()) {
    nextErrors.legalGuardianName = "Bei Minderjährigen ist die gesetzliche Vertretung erforderlich.";
  }

  if (!form.acceptsStatutes) {
    nextErrors.acceptsStatutes = "Bitte bestätige Satzung und Beitragsordnung.";
  }

  if (!form.acceptsPrivacyPolicy) {
    nextErrors.acceptsPrivacyPolicy = "Bitte erteile die DSGVO-Einwilligung.";
  }

  if (isMinor.value && !form.confirmsMinorAttachment) {
    nextErrors.confirmsMinorAttachment =
      "Bitte bestätige den Hinweis zur Aufsichtspflicht für Minderjährige.";
  }

  errors.value = nextErrors;
  return Object.keys(nextErrors).length === 0;
}

function handleSubmit(): void {
  submitSuccess.value = false;

  if (!validateForm()) {
    return;
  }

  form.iban = formatIban(form.iban);
  form.bic = form.bic.trim().toUpperCase();
  submitSuccess.value = true;
}

function clearFieldError(field: string): void {
  if (errors.value[field]) {
    const nextErrors = { ...errors.value };
    delete nextErrors[field];
    errors.value = nextErrors;
  }
}

function handleIbanBlur(): void {
  form.iban = formatIban(form.iban);
  clearFieldError("iban");
}

function handleBicBlur(): void {
  form.bic = form.bic.trim().toUpperCase();
  clearFieldError("bic");
}
</script>

<template>
  <div class="rounded-3xl border border-vsg-blue-100 bg-white p-6 shadow-sm md:p-8">
    <div
      class="mb-8 rounded-2xl border border-vsg-gold-300/40 bg-vsg-gold-50 px-5 py-4 text-vsg-blue-900"
    >
      <div class="flex items-start gap-3">
        <FontAwesomeIcon icon="circle-info" class="mt-1 text-vsg-gold-600" />
        <div class="space-y-2 font-body text-sm leading-relaxed md:text-base">
          <p class="font-semibold">Der digitale Versand ist noch nicht freigeschaltet.</p>
          <p>
            Du kannst das Formular bereits vollständig ausfüllen und prüfen. Bis zur Freischaltung
            nutzt der Verein weiterhin den bisherigen PDF-Antrag.
          </p>
          <a
            :href="PDF_APPLICATION_URL"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-2 font-semibold text-vsg-blue-700 underline hover:text-vsg-blue-900"
          >
            <FontAwesomeIcon icon="file-pdf" />
            PDF-Antrag öffnen
          </a>
        </div>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="submitSuccess"
        class="mb-8 rounded-2xl border border-green-200 bg-green-50 p-4"
        role="status"
        aria-live="polite"
      >
        <div class="flex items-start gap-3">
          <FontAwesomeIcon icon="check" class="mt-0.5 text-green-600" />
          <div class="font-body text-green-800">
            <p class="font-semibold">Die Eingaben wurden lokal erfolgreich geprüft.</p>
            <p>
              Der Online-Versand wird noch vorbereitet. Bis dahin reiche bitte weiterhin den
              PDF-Antrag ein.
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <form class="space-y-10" @submit.prevent="handleSubmit">
      <section class="space-y-4">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Abteilung</h2>
          <p class="mt-2 font-body text-vsg-blue-600">
            Wähle die Abteilung, für die der Aufnahmeantrag vorbereitet werden soll.
          </p>
        </div>

        <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label
            v-for="option in departmentOptions"
            :key="option.value"
            class="cursor-pointer rounded-2xl border-2 p-4 transition-colors"
            :class="[
              form.department === option.value
                ? `${option.accentClass} ${option.backgroundClass}`
                : 'border-vsg-blue-100 bg-white hover:border-vsg-blue-300',
            ]"
          >
            <input
              v-model="form.department"
              type="radio"
              name="department"
              :value="option.value"
              class="sr-only"
              @change="clearFieldError('department')"
            />
            <span class="font-display text-xl tracking-wide text-vsg-blue-900">{{ option.label }}</span>
          </label>
        </div>
        <p v-if="errors.department" class="text-sm font-body text-red-600">
          {{ errors.department }}
        </p>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">
            Persönliche Daten
          </h2>
          <p class="mt-2 font-body text-vsg-blue-600">
            Diese Angaben entsprechen dem auszufüllenden Teil des bisherigen Aufnahmeantrags.
          </p>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="lastName" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Name *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              maxlength="100"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.lastName ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('lastName')"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm font-body text-red-600">{{ errors.lastName }}</p>
          </div>

          <div>
            <label for="firstName" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Vorname *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              maxlength="100"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.firstName ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('firstName')"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm font-body text-red-600">{{ errors.firstName }}</p>
          </div>

          <div>
            <label for="birthDate" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Geboren am *
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.birthDate ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('birthDate')"
            />
            <p v-if="errors.birthDate" class="mt-1 text-sm font-body text-red-600">{{ errors.birthDate }}</p>
          </div>

          <div>
            <label for="phone" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Telefon *
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              maxlength="30"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.phone ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('phone')"
            />
            <p v-if="errors.phone" class="mt-1 text-sm font-body text-red-600">{{ errors.phone }}</p>
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">
            Adresse und Kontakt
          </h2>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div class="md:col-span-2">
            <label for="street" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Straße *
            </label>
            <input
              id="street"
              v-model="form.street"
              type="text"
              maxlength="120"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.street ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('street')"
            />
            <p v-if="errors.street" class="mt-1 text-sm font-body text-red-600">{{ errors.street }}</p>
          </div>

          <div>
            <label for="postalCode" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              PLZ *
            </label>
            <input
              id="postalCode"
              v-model="form.postalCode"
              type="text"
              inputmode="numeric"
              maxlength="5"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.postalCode ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('postalCode')"
            />
            <p v-if="errors.postalCode" class="mt-1 text-sm font-body text-red-600">{{ errors.postalCode }}</p>
          </div>

          <div>
            <label for="city" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Wohnort *
            </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              maxlength="100"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.city ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('city')"
            />
            <p v-if="errors.city" class="mt-1 text-sm font-body text-red-600">{{ errors.city }}</p>
          </div>

          <div>
            <label for="email" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Mailadresse *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              maxlength="120"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.email ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('email')"
            />
            <p v-if="errors.email" class="mt-1 text-sm font-body text-red-600">{{ errors.email }}</p>
          </div>

          <div class="md:col-span-2">
            <label for="otherClub" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Ich bin außerdem noch Mitglied im Verein
            </label>
            <input
              id="otherClub"
              v-model="form.otherClub"
              type="text"
              maxlength="160"
              placeholder="Optionaler Vereinsname"
              class="w-full rounded-xl border-2 border-vsg-blue-200 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Bankverbindung</h2>
          <p class="mt-2 font-body text-vsg-blue-600">
            Die Beitragszahlung erfolgt laut Antrag per Lastschrift. Die Daten werden aktuell noch
            nicht digital versendet.
          </p>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="bankName" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Kreditinstitut *
            </label>
            <input
              id="bankName"
              v-model="form.bankName"
              type="text"
              maxlength="120"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.bankName ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('bankName')"
            />
            <p v-if="errors.bankName" class="mt-1 text-sm font-body text-red-600">{{ errors.bankName }}</p>
          </div>

          <div>
            <label for="accountHolder" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              KontoinhaberIn *
            </label>
            <input
              id="accountHolder"
              v-model="form.accountHolder"
              type="text"
              maxlength="120"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.accountHolder ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('accountHolder')"
            />
            <p v-if="errors.accountHolder" class="mt-1 text-sm font-body text-red-600">{{ errors.accountHolder }}</p>
          </div>

          <div>
            <label for="iban" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              IBAN *
            </label>
            <input
              id="iban"
              v-model="form.iban"
              type="text"
              inputmode="text"
              maxlength="27"
              placeholder="DE12 3456 7890 1234 5678 90"
              class="w-full rounded-xl border-2 px-4 py-3 font-body uppercase text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.iban ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('iban')"
              @blur="handleIbanBlur"
            />
            <p v-if="errors.iban" class="mt-1 text-sm font-body text-red-600">{{ errors.iban }}</p>
          </div>

          <div>
            <label for="bic" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              BIC
            </label>
            <input
              id="bic"
              v-model="form.bic"
              type="text"
              maxlength="11"
              placeholder="Optional"
              class="w-full rounded-xl border-2 px-4 py-3 font-body uppercase text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.bic ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('bic')"
              @blur="handleBicBlur"
            />
            <p v-if="errors.bic" class="mt-1 text-sm font-body text-red-600">{{ errors.bic }}</p>
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">
            Erklärungen und Einwilligungen
          </h2>
        </div>

        <div class="space-y-4 rounded-2xl border border-vsg-blue-100 bg-vsg-blue-50 p-5">
          <label class="flex items-start gap-3">
            <input
              v-model="form.acceptsStatutes"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
              @change="clearFieldError('acceptsStatutes')"
            />
            <span class="font-body text-vsg-blue-900">
              Vereinssatzung und Beitragsordnung wurden mir ausgehändigt bzw. ich habe sie über
              die Homepage des Vereins zur Kenntnis genommen. *
            </span>
          </label>
          <p v-if="errors.acceptsStatutes" class="text-sm font-body text-red-600">
            {{ errors.acceptsStatutes }}
          </p>

          <label class="flex items-start gap-3">
            <input
              v-model="form.acceptsEmailInvitation"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
            />
            <span class="font-body text-vsg-blue-900">
              Ich bin damit einverstanden, dass Einladungen zur Jahreshauptversammlung an meine
              Mailadresse gesendet werden, sofern eine Mailadresse vorliegt.
            </span>
          </label>

          <label class="flex items-start gap-3">
            <input
              v-model="form.acceptsPrivacyPolicy"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
              @change="clearFieldError('acceptsPrivacyPolicy')"
            />
            <span class="font-body text-vsg-blue-900">
              Ich willige in die Verarbeitung und Speicherung personenbezogener Daten nach DSGVO
              ein. *
            </span>
          </label>
          <p v-if="errors.acceptsPrivacyPolicy" class="text-sm font-body text-red-600">
            {{ errors.acceptsPrivacyPolicy }}
          </p>

          <div
            v-if="isMinor"
            class="rounded-xl border border-vsg-gold-300/50 bg-white p-4 text-vsg-blue-900"
          >
            <p class="font-body text-sm leading-relaxed md:text-base">
              Für Minderjährige ist zusätzlich die Erklärung zur Aufsichtspflicht für das Kind als
              Anlage vorgesehen.
            </p>
            <label class="mt-4 flex items-start gap-3">
              <input
                v-model="form.confirmsMinorAttachment"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
                @change="clearFieldError('confirmsMinorAttachment')"
              />
              <span class="font-body text-vsg-blue-900">
                Ich habe den Hinweis zur Aufsichtspflicht für Minderjährige zur Kenntnis genommen.
                *
              </span>
            </label>
            <p v-if="errors.confirmsMinorAttachment" class="mt-2 text-sm font-body text-red-600">
              {{ errors.confirmsMinorAttachment }}
            </p>
          </div>

          <p class="font-body text-sm text-vsg-blue-700">
            Details zu Satzung, Beitragsordnung und Datenschutz findest du unter
            <RouterLink to="/verein/satzung" class="font-semibold underline hover:text-vsg-blue-900">
              Satzung
            </RouterLink>,
            <RouterLink
              to="/verein/beitragsordnung"
              class="font-semibold underline hover:text-vsg-blue-900"
            >
              Beitragsordnung
            </RouterLink>
            und
            <RouterLink to="/datenschutz" class="font-semibold underline hover:text-vsg-blue-900">
              Datenschutz
            </RouterLink>.
          </p>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Bestätigung</h2>
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          <div>
            <label for="place" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Ort *
            </label>
            <input
              id="place"
              v-model="form.place"
              type="text"
              maxlength="100"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.place ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('place')"
            />
            <p v-if="errors.place" class="mt-1 text-sm font-body text-red-600">{{ errors.place }}</p>
          </div>

          <div>
            <label for="applicationDate" class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600">
              Datum *
            </label>
            <input
              id="applicationDate"
              v-model="form.applicationDate"
              type="date"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.applicationDate ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('applicationDate')"
            />
            <p v-if="errors.applicationDate" class="mt-1 text-sm font-body text-red-600">
              {{ errors.applicationDate }}
            </p>
          </div>

          <div class="md:col-span-2">
            <label
              for="legalGuardianName"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Gesetzliche VertreterIn<span v-if="isMinor"> *</span>
            </label>
            <input
              id="legalGuardianName"
              v-model="form.legalGuardianName"
              type="text"
              maxlength="120"
              :placeholder="isMinor ? 'Pflichtfeld bei Minderjährigen' : 'Nur bei Minderjährigen erforderlich'"
              class="w-full rounded-xl border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.legalGuardianName ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('legalGuardianName')"
            />
            <p v-if="errors.legalGuardianName" class="mt-1 text-sm font-body text-red-600">
              {{ errors.legalGuardianName }}
            </p>
          </div>
        </div>
      </section>

      <div class="flex flex-col gap-4 border-t border-vsg-blue-100 pt-6 md:flex-row md:items-center md:justify-between">
        <p class="max-w-2xl font-body text-sm text-vsg-blue-600">
          Mit dem Klick auf den Button wird noch nichts versendet. Das Formular wird nur lokal auf
          Vollständigkeit geprüft.
        </p>
        <button
          type="submit"
          class="inline-flex items-center justify-center rounded-xl bg-vsg-blue-900 px-6 py-3 font-display text-lg tracking-wider text-vsg-gold-400 transition-colors hover:bg-vsg-blue-800"
        >
          Formular prüfen
        </button>
      </div>
    </form>
  </div>
</template>
