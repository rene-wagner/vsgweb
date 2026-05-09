<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  departmentValues,
  formatIban,
  isMinorByBirthDate,
  normalizeIban,
  validateMembershipApplication,
  type Department,
  type MembershipApplicationFormData,
} from "@/lib/validation/membership-application";
import {
  submitMembershipApplication,
  type MembershipApplicationPayload,
} from "@/services/membership-application/membership-application.service";

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

const route = useRoute();

function getDepartmentFromQuery(value: unknown): Department | "" {
  const queryValue = Array.isArray(value) ? value[0] : value;

  if (typeof queryValue !== "string") {
    return "";
  }

  return departmentValues.includes(queryValue as Department) ? (queryValue as Department) : "";
}

const form = reactive<MembershipApplicationFormData>({
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
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);
const submitSuccessPdfUrl = ref<string | null>(null);
const confirmsValidityWithoutSignature = ref(false);

const isMinor = computed(() => isMinorByBirthDate(form.birthDate));

watch(
  () => route.query.abteilung,
  (abteilung) => {
    const department = getDepartmentFromQuery(abteilung);

    if (department) {
      form.department = department;
      clearFieldError("department");
    }
  },
  { immediate: true },
);

function toMembershipApplicationPayload(): MembershipApplicationPayload {
  return {
    department: form.department,
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    birthDate: form.birthDate,
    phone: form.phone.trim(),
    email: form.email.trim(),
    street: form.street.trim(),
    postalCode: form.postalCode.trim(),
    city: form.city.trim(),
    otherClub: form.otherClub.trim(),
    bankName: form.bankName.trim(),
    iban: normalizeIban(form.iban),
    bic: form.bic.trim().toUpperCase(),
    accountHolder: form.accountHolder.trim(),
    place: form.place.trim(),
    applicationDate: form.applicationDate,
    legalGuardianName: form.legalGuardianName.trim(),
    acceptsStatutes: form.acceptsStatutes,
    acceptsEmailInvitation: form.acceptsEmailInvitation,
    acceptsPrivacyPolicy: form.acceptsPrivacyPolicy,
    confirmsMinorAttachment: form.confirmsMinorAttachment,
  };
}

async function handleSubmit(): Promise<void> {
  submitSuccess.value = false;
  submitSuccessPdfUrl.value = null;
  submitError.value = null;

  const validationResult = validateMembershipApplication(form);
  errors.value = validationResult.errors;

  if (!confirmsValidityWithoutSignature.value) {
    errors.value = {
      ...errors.value,
      confirmsValidityWithoutSignature:
        "Bitte bestätige, dass der Antrag auch ohne Unterschrift gültig ist.",
    };
  }

  if (!validationResult.success || !confirmsValidityWithoutSignature.value) {
    return;
  }

  form.iban = formatIban(form.iban);
  form.bic = form.bic.trim().toUpperCase();

  isSubmitting.value = true;

  try {
    submitSuccessPdfUrl.value = await submitMembershipApplication(toMembershipApplicationPayload());
    submitSuccess.value = true;
  } catch (error) {
    submitError.value =
      error instanceof Error && error.message.length > 0
        ? error.message
        : "Ein Netzwerkfehler ist aufgetreten. Bitte versuche es erneut.";
  } finally {
    isSubmitting.value = false;
  }
}

function clearFieldError(field: string): void {
  if (errors.value[field]) {
    const nextErrors = { ...errors.value };
    delete nextErrors[field];
    errors.value = nextErrors;
  }
}

function handleValidityWithoutSignatureChange(): void {
  clearFieldError("confirmsValidityWithoutSignature");
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
      v-if="!submitSuccess"
      class="mb-8 rounded-2xl border border-vsg-gold-300/40 bg-vsg-gold-50 px-5 py-4 text-vsg-blue-900"
    >
      <div class="flex items-start gap-3">
        <FontAwesomeIcon icon="circle-info" class="mt-1 text-vsg-gold-600" />
        <div class="space-y-2 font-body text-sm leading-relaxed md:text-base">
          <p class="font-semibold">Der Aufnahmeantrag wird digital an den Verein übermittelt.</p>
          <p>
            Bitte fülle alle Pflichtfelder sorgfältig aus.
          </p>
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
            <p class="font-semibold">Der Aufnahmeantrag wurde erfolgreich versendet.</p>
            <p>
              Deine Angaben wurden an den Verein übermittelt und können nun weiterverarbeitet
              werden.
            </p>
            <p v-if="submitSuccessPdfUrl" class="mt-3">
              <a
                :href="submitSuccessPdfUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="font-semibold underline hover:text-green-900"
              >
                PDF zum Aufnahmeantrag öffnen
              </a>
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="submitError && !submitSuccess"
        class="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-start gap-3">
          <FontAwesomeIcon icon="exclamation-triangle" class="mt-0.5 text-red-600" />
          <p class="font-body text-red-800">{{ submitError }}</p>
        </div>
      </div>
    </Transition>

    <form v-if="!submitSuccess" class="space-y-10" :aria-busy="isSubmitting" @submit.prevent="handleSubmit">
      <section class="space-y-4">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Abteilung</h2>
          <p class="mt-2 font-body text-vsg-blue-600">
            Wähle die Abteilung, für die du die Mitgliedschaft beantragen möchtest.
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
            Bitte trage hier deine persönlichen Daten vollständig ein.
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
            Die Beitragszahlung erfolgt per Lastschrift. Deine Angaben werden sicher digital an
            den Verein übermittelt.
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
              Ich habe die Vereinssatzung und Beitragsordnung zur Kenntnis genommen. *
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
              Für Minderjährige gelten zusätzliche Hinweise zur Aufsichtspflicht.
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
        <div class="max-w-2xl space-y-2">
          <label class="flex items-center gap-3">
            <input
              v-model="confirmsValidityWithoutSignature"
              type="checkbox"
              class="h-4 w-4 shrink-0 rounded border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
              @change="handleValidityWithoutSignatureChange"
            />
            <span class="font-body text-sm leading-relaxed text-vsg-blue-600">
              Ich bestätige, dass dieses Formular auch ohne Unterschrift gültig ist.
            </span>
          </label>
          <p v-if="errors.confirmsValidityWithoutSignature" class="pl-7 text-sm font-body text-red-600">
            {{ errors.confirmsValidityWithoutSignature }}
          </p>
        </div>
        <button
          type="submit"
          :disabled="isSubmitting || !confirmsValidityWithoutSignature"
          class="inline-flex items-center justify-center rounded-xl bg-vsg-blue-900 px-6 py-3 font-display text-lg tracking-wider text-vsg-gold-400 transition-colors hover:bg-vsg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ isSubmitting ? "Wird gesendet..." : "Aufnahmeantrag senden" }}
        </button>
      </div>
    </form>
  </div>
</template>
