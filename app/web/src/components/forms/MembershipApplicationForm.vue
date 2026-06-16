<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { RouterLink, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  departmentValues,
  formatIban,
  getAgeFromBirthDate,
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
  acceptsStatutes: false,
  acceptsEmailInvitation: false,
  acceptsPrivacyPolicy: false,
  place: "",
  applicationDate: new Date().toISOString().slice(0, 10),
  bankName: "",
  iban: "",
  bic: "",
  accountHolder: "",
  isChild: false,
  guardianOneName: "",
  guardianOneAddress: "",
  guardianOnePhone: "",
  guardianTwoName: "",
  guardianTwoAddress: "",
  guardianTwoPhone: "",
  underTwelveMayWalkHomeAlone: null,
  overTwelveMayWalkHomeAlone: null,
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);
const submitSuccessPdfUrl = ref<string | null>(null);
const submitSuccessSupervisionDutyPdfUrl = ref<string | null>(null);
const confirmsValidityWithoutSignature = ref(false);

const childAge = computed(() => getAgeFromBirthDate(form.birthDate));
const isChildUnderTwelve = computed(() => childAge.value !== null && childAge.value < 12);
const isChildTwelveOrOlder = computed(() => childAge.value !== null && childAge.value >= 12);

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

watch(
  () => form.isChild,
  (isChild) => {
    if (isChild) {
      return;
    }

    form.guardianOneName = "";
    form.guardianOneAddress = "";
    form.guardianOnePhone = "";
    form.guardianTwoName = "";
    form.guardianTwoAddress = "";
    form.guardianTwoPhone = "";
    form.underTwelveMayWalkHomeAlone = null;
    form.overTwelveMayWalkHomeAlone = null;

    clearFieldError("guardianOneName");
    clearFieldError("guardianOneAddress");
    clearFieldError("guardianOnePhone");
    clearFieldError("guardianTwoName");
    clearFieldError("guardianTwoAddress");
    clearFieldError("guardianTwoPhone");
    clearFieldError("underTwelveMayWalkHomeAlone");
    clearFieldError("overTwelveMayWalkHomeAlone");
  },
);

watch(isChildUnderTwelve, (value) => {
  if (value) {
    form.overTwelveMayWalkHomeAlone = null;
    clearFieldError("overTwelveMayWalkHomeAlone");
  }
});

watch(isChildTwelveOrOlder, (value) => {
  if (value) {
    form.underTwelveMayWalkHomeAlone = null;
    clearFieldError("underTwelveMayWalkHomeAlone");
  }
});

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
    acceptsStatutes: form.acceptsStatutes,
    acceptsEmailInvitation: form.acceptsEmailInvitation,
    acceptsPrivacyPolicy: form.acceptsPrivacyPolicy,
    place: form.place.trim() || form.city.trim(),
    applicationDate: form.applicationDate,
    bankName: form.bankName.trim(),
    iban: normalizeIban(form.iban),
    bic: form.bic.trim().toUpperCase(),
    accountHolder: form.accountHolder.trim(),
    legalGuardianName: [form.guardianOneName.trim(), form.guardianTwoName.trim()]
      .filter((value) => value.length > 0)
      .join(" / "),
    confirmsMinorAttachment: form.isChild,
    isChild: form.isChild,
    guardianOneName: form.guardianOneName.trim(),
    guardianOneAddress: form.guardianOneAddress.trim(),
    guardianOnePhone: form.guardianOnePhone.trim(),
    guardianTwoName: form.guardianTwoName.trim(),
    guardianTwoAddress: form.guardianTwoAddress.trim(),
    guardianTwoPhone: form.guardianTwoPhone.trim(),
    underTwelveMayWalkHomeAlone: form.underTwelveMayWalkHomeAlone,
    overTwelveMayWalkHomeAlone: form.overTwelveMayWalkHomeAlone,
  };
}

async function handleSubmit(): Promise<void> {
  submitSuccess.value = false;
  submitSuccessPdfUrl.value = null;
  submitSuccessSupervisionDutyPdfUrl.value = null;
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
    const submitResult = await submitMembershipApplication(toMembershipApplicationPayload());
    submitSuccessPdfUrl.value = submitResult.applicationPdfUrl;
    submitSuccessSupervisionDutyPdfUrl.value = submitResult.supervisionDutyPdfUrl;
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

function setBooleanField(
  field: "underTwelveMayWalkHomeAlone" | "overTwelveMayWalkHomeAlone",
  value: boolean,
): void {
  form[field] = value;
  clearFieldError(field);
}
</script>

<template>
  <div class="rounded-md border border-vsg-blue-100 bg-white p-6 shadow-sm md:p-8">
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
        class="mb-8 rounded-md border border-green-200 bg-green-50 p-4"
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
            <div class="mt-3 space-y-2">
              <p v-if="submitSuccessPdfUrl">
                <a
                  :href="submitSuccessPdfUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold underline hover:text-green-900"
                >
                  PDF zum Aufnahmeantrag öffnen
                </a>
              </p>
              <p v-if="submitSuccessSupervisionDutyPdfUrl">
                <a
                  :href="submitSuccessSupervisionDutyPdfUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="font-semibold underline hover:text-green-900"
                >
                  PDF zur Aufsichtspflicht öffnen
                </a>
              </p>
            </div>
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
        class="mb-8 rounded-md border border-red-200 bg-red-50 p-4"
        role="alert"
        aria-live="polite"
      >
        <div class="flex items-start gap-3">
          <FontAwesomeIcon icon="exclamation-triangle" class="mt-0.5 text-red-600" />
          <p class="font-body text-red-800">{{ submitError }}</p>
        </div>
      </div>
    </Transition>

    <form
      v-if="!submitSuccess"
      class="space-y-10"
      :aria-busy="isSubmitting"
      @submit.prevent="handleSubmit"
    >
      <section class="space-y-4">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Abteilung</h2>
          <p class="mt-2 font-body text-vsg-blue-600">
            Wähle die Abteilung, für die du die Mitgliedschaft beantragen möchtest.
          </p>
        </div>

        <div class="department-flex-row">
          <label
            v-for="option in departmentOptions"
            :key="option.value"
            class="cursor-pointer rounded-md border-2 p-4 transition-colors"
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
            <span class="font-display text-xl tracking-wide text-vsg-blue-900">{{
              option.label
            }}</span>
          </label>
        </div>
        <p v-if="errors.department" class="text-sm font-body text-red-600">
          {{ errors.department }}
        </p>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Persönliche Daten</h2>
        </div>

        <div class="form-flex-row">
          <div>
            <label
              for="lastName"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Name *
            </label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              maxlength="100"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.lastName ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('lastName')"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm font-body text-red-600">
              {{ errors.lastName }}
            </p>
          </div>

          <div>
            <label
              for="firstName"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Vorname *
            </label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              maxlength="100"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.firstName ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('firstName')"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm font-body text-red-600">
              {{ errors.firstName }}
            </p>
          </div>

          <div>
            <label
              for="birthDate"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Geboren am *
            </label>
            <input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.birthDate ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('birthDate')"
            />
            <p v-if="errors.birthDate" class="mt-1 text-sm font-body text-red-600">
              {{ errors.birthDate }}
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">
            Adresse und Kontakt
          </h2>
        </div>

        <div class="form-flex-row">
          <div class="form-flex-full">
            <label
              for="street"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Straße *
            </label>
            <input
              id="street"
              v-model="form.street"
              type="text"
              maxlength="120"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.street ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('street')"
            />
            <p v-if="errors.street" class="mt-1 text-sm font-body text-red-600">
              {{ errors.street }}
            </p>
          </div>

          <div>
            <label
              for="postalCode"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              PLZ *
            </label>
            <input
              id="postalCode"
              v-model="form.postalCode"
              type="text"
              inputmode="numeric"
              maxlength="5"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.postalCode ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('postalCode')"
            />
            <p v-if="errors.postalCode" class="mt-1 text-sm font-body text-red-600">
              {{ errors.postalCode }}
            </p>
          </div>

          <div>
            <label
              for="city"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Wohnort *
            </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              maxlength="100"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.city ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('city')"
            />
            <p v-if="errors.city" class="mt-1 text-sm font-body text-red-600">{{ errors.city }}</p>
          </div>

          <div>
            <label
              for="phone"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Telefon *
            </label>
            <input
              id="phone"
              v-model="form.phone"
              type="tel"
              maxlength="30"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.phone ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('phone')"
            />
            <p v-if="errors.phone" class="mt-1 text-sm font-body text-red-600">
              {{ errors.phone }}
            </p>
          </div>

          <div>
            <label
              for="email"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Mailadresse *
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              maxlength="120"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.email ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('email')"
            />
            <p v-if="errors.email" class="mt-1 text-sm font-body text-red-600">
              {{ errors.email }}
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">
            Erklärungen / Hinweise zur Beitragszahlung / Einwilligung nach DSGVO
          </h2>
        </div>

        <div class="space-y-5 rounded-md border border-vsg-blue-100 bg-vsg-blue-50 p-5">
          <div class="space-y-3 font-body text-sm leading-relaxed text-vsg-blue-900 md:text-base">
            <p>
              Vereinssatzung und Beitragsordnung wurden mir ausgehändigt bzw. habe ich über die
              Homepage des Vereins www.vsg-kugelberg.de zur Kenntnis genommen. Ich erkenne sie in
              vollem Umfang an.
            </p>
            <p>
              Ich bin außerdem damit einverstanden, dass die Einladung zur Jahreshauptversammlung
              auch und sofern vorhanden über meine Mailadresse erfolgt.
            </p>
            <p>
              Die Beitragszahlung erfolgt auf Grundlage der nachfolgend zu erteilenden
              Einzugsermächtigung jeweils zum 10. des Quartalsbeginns (10.01; 10.04; 10.07; 10.10);
              Gläubigeridentifikationsnummer: DE86VSG00000976375; Mandatsreferenznummer: eigene
              Vereinsmitgliedsnummer (wird nach positivem Aufnahmebeschluss des Vorstands
              mitgeteilt).
            </p>
          </div>

          <div class="space-y-4">
            <label class="flex items-start gap-3">
              <input
                v-model="form.acceptsStatutes"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
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
                class="mt-1 h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
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
                class="mt-1 h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
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
          </div>

          <p class="font-body text-sm text-vsg-blue-700">
            Details zu Satzung, Beitragsordnung und Datenschutz findest du unter
            <RouterLink
              to="/verein/satzung"
              class="font-semibold underline hover:text-vsg-blue-900"
            >
              Satzung </RouterLink
            >,
            <RouterLink
              to="/verein/beitragsordnung"
              class="font-semibold underline hover:text-vsg-blue-900"
            >
              Beitragsordnung
            </RouterLink>
            und
            <RouterLink to="/datenschutz" class="font-semibold underline hover:text-vsg-blue-900">
              Datenschutz </RouterLink
            >.
          </p>
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Bankverbindung</h2>
          <p class="mt-2 font-body text-vsg-blue-600">
            Hiermit ermächtige ich den Verein widerruflich, die von mir zu entrichtende Zahlung des
            Mitgliedsbeitrages bei Fälligkeit zu Lasten meines Kontos durch Lastschrift einzuziehen.
          </p>
        </div>

        <div class="form-flex-row">
          <div>
            <label
              for="bankName"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              Kreditinstitut *
            </label>
            <input
              id="bankName"
              v-model="form.bankName"
              type="text"
              maxlength="120"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.bankName ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('bankName')"
            />
            <p v-if="errors.bankName" class="mt-1 text-sm font-body text-red-600">
              {{ errors.bankName }}
            </p>
          </div>

          <div>
            <label
              for="accountHolder"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              KontoinhaberIn *
            </label>
            <input
              id="accountHolder"
              v-model="form.accountHolder"
              type="text"
              maxlength="120"
              class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.accountHolder ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('accountHolder')"
            />
            <p v-if="errors.accountHolder" class="mt-1 text-sm font-body text-red-600">
              {{ errors.accountHolder }}
            </p>
          </div>

          <div>
            <label
              for="iban"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              IBAN *
            </label>
            <input
              id="iban"
              v-model="form.iban"
              type="text"
              inputmode="text"
              maxlength="27"
              placeholder="DE12 3456 7890 1234 5678 90"
              class="w-full rounded-md border-2 px-4 py-3 font-body uppercase text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
              :class="errors.iban ? 'border-red-300' : 'border-vsg-blue-200'"
              @input="clearFieldError('iban')"
              @blur="handleIbanBlur"
            />
            <p v-if="errors.iban" class="mt-1 text-sm font-body text-red-600">{{ errors.iban }}</p>
          </div>

          <div>
            <label
              for="bic"
              class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
            >
              BIC
            </label>
            <input
              id="bic"
              v-model="form.bic"
              type="text"
              maxlength="11"
              placeholder="Optional"
              class="w-full rounded-md border-2 px-4 py-3 font-body uppercase text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
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
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">Anderer Verein</h2>
        </div>

        <div>
          <label
            for="otherClub"
            class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
          >
            Ich bin außerdem noch Mitglied im Verein
          </label>
          <input
            id="otherClub"
            v-model="form.otherClub"
            type="text"
            maxlength="160"
            placeholder="Optionaler Vereinsname"
            class="w-full rounded-md border-2 border-vsg-blue-200 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
          />
        </div>
      </section>

      <section class="space-y-5">
        <div>
          <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">
            Angabe, ob es sich um ein Kind handelt
          </h2>
        </div>

        <div class="space-y-5 rounded-md border border-vsg-blue-100 bg-vsg-blue-50 p-5">
          <label class="flex items-start gap-3">
            <input
              v-model="form.isChild"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
            />
            <span class="font-body text-vsg-blue-900">
              Es handelt sich bei der antragstellenden Person um ein Kind.
            </span>
          </label>

          <div v-if="form.isChild" class="space-y-5">
            <p class="font-body text-sm leading-relaxed text-vsg-blue-900 md:text-base">
              Bitte ergänze die Angaben aus der Erklärung zur Aufsichtspflicht.
            </p>

            <div class="rounded-md border border-vsg-gold-300/50 bg-white p-4">
              <h3 class="font-display text-xl tracking-wide text-vsg-blue-900">
                Erziehungsberechtigte Person 1
              </h3>
              <div class="form-flex-row mt-4">
                <div>
                  <label
                    for="guardianOneName"
                    class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
                  >
                    Name, Vorname *
                  </label>
                  <input
                    id="guardianOneName"
                    v-model="form.guardianOneName"
                    type="text"
                    maxlength="120"
                    class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
                    :class="errors.guardianOneName ? 'border-red-300' : 'border-vsg-blue-200'"
                    @input="clearFieldError('guardianOneName')"
                  />
                  <p v-if="errors.guardianOneName" class="mt-1 text-sm font-body text-red-600">
                    {{ errors.guardianOneName }}
                  </p>
                </div>

                <div>
                  <label
                    for="guardianOnePhone"
                    class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
                  >
                    Telefon *
                  </label>
                  <input
                    id="guardianOnePhone"
                    v-model="form.guardianOnePhone"
                    type="tel"
                    maxlength="30"
                    class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
                    :class="errors.guardianOnePhone ? 'border-red-300' : 'border-vsg-blue-200'"
                    @input="clearFieldError('guardianOnePhone')"
                  />
                  <p v-if="errors.guardianOnePhone" class="mt-1 text-sm font-body text-red-600">
                    {{ errors.guardianOnePhone }}
                  </p>
                </div>

                <div class="form-flex-full">
                  <label
                    for="guardianOneAddress"
                    class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
                  >
                    Anschrift *
                  </label>
                  <input
                    id="guardianOneAddress"
                    v-model="form.guardianOneAddress"
                    type="text"
                    maxlength="160"
                    class="w-full rounded-md border-2 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
                    :class="errors.guardianOneAddress ? 'border-red-300' : 'border-vsg-blue-200'"
                    @input="clearFieldError('guardianOneAddress')"
                  />
                  <p v-if="errors.guardianOneAddress" class="mt-1 text-sm font-body text-red-600">
                    {{ errors.guardianOneAddress }}
                  </p>
                </div>
              </div>
            </div>

            <div class="rounded-md border border-vsg-blue-100 bg-white p-4">
              <h3 class="font-display text-xl tracking-wide text-vsg-blue-900">
                Erziehungsberechtigte Person 2
              </h3>
              <p class="mt-2 font-body text-sm text-vsg-blue-600">Optional</p>
              <div class="form-flex-row mt-4">
                <div>
                  <label
                    for="guardianTwoName"
                    class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
                  >
                    Name, Vorname
                  </label>
                  <input
                    id="guardianTwoName"
                    v-model="form.guardianTwoName"
                    type="text"
                    maxlength="120"
                    class="w-full rounded-md border-2 border-vsg-blue-200 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    for="guardianTwoPhone"
                    class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
                  >
                    Telefon
                  </label>
                  <input
                    id="guardianTwoPhone"
                    v-model="form.guardianTwoPhone"
                    type="tel"
                    maxlength="30"
                    class="w-full rounded-md border-2 border-vsg-blue-200 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
                  />
                </div>

                <div class="form-flex-full">
                  <label
                    for="guardianTwoAddress"
                    class="mb-2 block font-body text-sm uppercase tracking-wider text-vsg-blue-600"
                  >
                    Anschrift
                  </label>
                  <input
                    id="guardianTwoAddress"
                    v-model="form.guardianTwoAddress"
                    type="text"
                    maxlength="160"
                    class="w-full rounded-md border-2 border-vsg-blue-200 px-4 py-3 font-body text-vsg-blue-900 focus:border-vsg-gold-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <fieldset class="space-y-3 rounded-md border border-vsg-gold-300/50 bg-white p-4">
              <div class="font-body font-semibold leading-relaxed text-vsg-blue-900">
                Sofern unser/mein Kind das 12. Lebensjahr noch nicht vollendet hat, verpflichten wir
                uns / ich mich dafür Sorge zu tragen, dass es sicher zur Sportstätte und nach dem
                Training / Wettkampf wieder nach Hause gelangt.
              </div>
              <p class="font-body text-sm leading-relaxed text-vsg-blue-700">
                Ausnahmeregelung: Da unser/mein Kind in der Nähe der Sportstätte wohnt bzw. unter
                normalen Umständen gefahrlos dorthin gelangen kann, darf es nach dem regulären
                Trainings- / Wettkampfende auch ohne Begleitung den Heimweg antreten.
                <span v-if="isChildUnderTwelve" class="font-semibold">*</span>
              </p>
              <label class="flex items-center gap-3 font-body text-vsg-blue-900">
                <input
                  :checked="form.underTwelveMayWalkHomeAlone === true"
                  type="radio"
                  name="underTwelveMayWalkHomeAlone"
                  class="h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
                  @change="setBooleanField('underTwelveMayWalkHomeAlone', true)"
                />
                Ja
              </label>
              <label class="flex items-center gap-3 font-body text-vsg-blue-900">
                <input
                  :checked="form.underTwelveMayWalkHomeAlone === false"
                  type="radio"
                  name="underTwelveMayWalkHomeAlone"
                  class="h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
                  @change="setBooleanField('underTwelveMayWalkHomeAlone', false)"
                />
                Nein
              </label>
              <p v-if="errors.underTwelveMayWalkHomeAlone" class="text-sm font-body text-red-600">
                {{ errors.underTwelveMayWalkHomeAlone }}
              </p>
            </fieldset>

            <fieldset class="space-y-3 rounded-md border border-vsg-gold-300/50 bg-white p-4">
              <div class="font-body font-semibold leading-relaxed text-vsg-blue-900">
                Sofern unser/mein Kind das 12. Lebensjahr vollendet hat, darf es nach dem regulären
                Trainings- / Wettkampfende auch ohne Begleitung den Heimweg antreten.
                <span v-if="isChildTwelveOrOlder" class="font-semibold">*</span>
              </div>
              <label class="flex items-center gap-3 font-body text-vsg-blue-900">
                <input
                  :checked="form.overTwelveMayWalkHomeAlone === true"
                  type="radio"
                  name="overTwelveMayWalkHomeAlone"
                  class="h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
                  @change="setBooleanField('overTwelveMayWalkHomeAlone', true)"
                />
                Ja
              </label>
              <label class="flex items-center gap-3 font-body text-vsg-blue-900">
                <input
                  :checked="form.overTwelveMayWalkHomeAlone === false"
                  type="radio"
                  name="overTwelveMayWalkHomeAlone"
                  class="h-4 w-4 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
                  @change="setBooleanField('overTwelveMayWalkHomeAlone', false)"
                />
                Nein
              </label>
              <p v-if="errors.overTwelveMayWalkHomeAlone" class="text-sm font-body text-red-600">
                {{ errors.overTwelveMayWalkHomeAlone }}
              </p>
            </fieldset>
          </div>
        </div>
      </section>

      <div
        class="flex flex-col gap-4 border-t border-vsg-blue-100 pt-6 md:flex-row md:items-center md:justify-between"
      >
        <div class="max-w-2xl space-y-2">
          <label class="flex items-center gap-3">
            <input
              v-model="confirmsValidityWithoutSignature"
              type="checkbox"
              class="h-4 w-4 shrink-0 rounded-md border-vsg-blue-300 text-vsg-gold-500 focus:ring-vsg-gold-400"
              @change="handleValidityWithoutSignatureChange"
            />
            <span class="font-body text-sm leading-relaxed text-vsg-blue-600">
              Ich bestätige, dass dieses Formular auch ohne Unterschrift gültig ist.
            </span>
          </label>
          <p
            v-if="errors.confirmsValidityWithoutSignature"
            class="pl-7 text-sm font-body text-red-600"
          >
            {{ errors.confirmsValidityWithoutSignature }}
          </p>
        </div>
        <button
          type="submit"
          :disabled="isSubmitting || !confirmsValidityWithoutSignature"
          class="inline-flex items-center justify-center rounded-md bg-vsg-blue-900 px-6 py-3 font-display text-lg tracking-wider text-vsg-gold-400 transition-colors hover:bg-vsg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {{ isSubmitting ? "Wird gesendet..." : "Aufnahmeantrag senden" }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-flex-row,
.department-flex-row {
  display: flex;
  flex-direction: column;
}

.form-flex-row > * + * {
  margin-top: 1.25rem;
}

.department-flex-row > * + * {
  margin-top: 0.75rem;
}

@media (min-width: 768px) {
  .form-flex-row {
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: -1.25rem;
    margin-left: -1.25rem;
  }

  .form-flex-row > * {
    flex: 0 0 calc(50% - 1.25rem);
    margin-bottom: 1.25rem;
    margin-left: 1.25rem;
    margin-top: 0;
    min-width: 0;
  }

  .form-flex-row > .form-flex-full {
    flex-basis: calc(100% - 1.25rem);
  }

  .department-flex-row {
    flex-direction: row;
    flex-wrap: wrap;
    margin-bottom: -0.75rem;
    margin-left: -0.75rem;
  }

  .department-flex-row > * {
    flex: 0 0 calc(50% - 0.75rem);
    margin-bottom: 0.75rem;
    margin-left: 0.75rem;
    margin-top: 0;
    min-width: 0;
  }
}

@media (min-width: 1280px) {
  .department-flex-row > * {
    flex-basis: calc(25% - 0.75rem);
  }
}
</style>
