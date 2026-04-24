<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useContactPeopleStore, type ContactPerson } from "@/stores/contactPeopleStore";
import ContactForm from "../components/forms/ContactForm.vue";
import SecureContact from "../components/forms/SecureContact.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ApiState from "@/components/ui/ApiState.vue";
import HeroSectionSmall from "../components/content/HeroSectionSmall.vue";
import { getUploadUrl } from "@/services/media-items/media-item.service";

const route = useRoute();
const contactPeopleStore = useContactPeopleStore();
const selectedContactPersonId = ref<number | null>(null);

const selectedContactPerson = computed<ContactPerson | null>(() => {
  if (selectedContactPersonId.value === null) {
    return null;
  }
  return (
    contactPeopleStore.contactPeople.find((cp) => cp.id === selectedContactPersonId.value) || null
  );
});

onMounted(async () => {
  await contactPeopleStore.ensureLoaded();

  // Check for person query parameter to pre-select contact person
  const personIdParam = route.query.person;
  if (personIdParam) {
    const personId = Number(personIdParam);
    if (!isNaN(personId) && personId > 0) {
      // Verify contact person exists
      const exists = contactPeopleStore.contactPeople.some((cp) => cp.id === personId);
      if (exists) {
        selectedContactPersonId.value = personId;
      }
    }
  }
});

function formatOptionLabel(cp: ContactPerson): string {
  return `${cp.type}: ${cp.firstName} ${cp.lastName}`;
}

function getInitials(cp: ContactPerson): string {
  const firstInitial = cp.firstName.charAt(0).toUpperCase();
  const lastInitial = cp.lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
}

function getProfileImageUrl(cp: ContactPerson): string | null {
  if (!cp.profileImage) return null;

  return getUploadUrl(cp.profileImage.url ?? cp.profileImage.display_url ?? cp.profileImage.name);
}

function encodeBase64(value: string): string {
  try {
    return btoa(value);
  } catch (e) {
    console.error("Failed to encode to base64", e);
    return "";
  }
}
</script>

<template>
  <div
    class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      headline="Kontakt"
      description="Finde die richtige Ansprechperson"
      headline-uuid="contact-hero-headline"
      description-uuid="contact-hero-description"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-2xl px-6">
        <ApiState
          :is-loading="contactPeopleStore.isLoading"
          :error="contactPeopleStore.error"
          :empty="contactPeopleStore.contactPeople.length === 0"
          empty-message="Derzeit sind keine Ansprechpartner verfügbar."
        >
          <div>
            <div class="mb-8">
              <label
                for="contact-person-select"
                class="block font-body font-normal text-sm tracking-wider text-vsg-blue-600 uppercase mb-3"
              >
                Ansprechpartner wählen
              </label>
              <select
                id="contact-person-select"
                v-model="selectedContactPersonId"
                class="w-full px-4 py-3 bg-white border-2 border-vsg-blue-200 rounded-xl text-vsg-blue-900 text-lg font-body focus:outline-none focus:border-vsg-gold-400 transition-colors cursor-pointer appearance-none"
                style="
                  background-image: url(&quot;data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%231E3A5F%22%20d%3D%22M10.293%203.293%206%207.586%201.707%203.293A1%201%200%200%200%20.293%204.707l5%205a1%201%200%200%200%201.414%200l5-5a1%201%200%201%200-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E&quot;);
                  background-repeat: no-repeat;
                  background-position: right 1rem center;
                  padding-right: 2.5rem;
                "
              >
                <option :value="null">Bitte wählen...</option>
                <option v-for="cp in contactPeopleStore.contactPeople" :key="cp.id" :value="cp.id">
                  {{ formatOptionLabel(cp) }}
                </option>
              </select>
            </div>

            <!-- Contact Details Card -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-4"
            >
              <div
                v-if="selectedContactPerson"
                class="bg-vsg-blue-50 border border-vsg-blue-100 rounded-2xl p-8"
              >
                <!-- Profile Image and Name/Role Header -->
                <div class="mb-6 pb-6 border-b border-vsg-blue-200">
                  <div class="flex items-center gap-6">
                    <!-- Profile Image or Initials Fallback -->
                    <div
                      class="shrink-0 w-32 h-32 rounded-full overflow-hidden bg-vsg-blue-100 flex items-center justify-center"
                    >
                      <img
                        v-if="selectedContactPerson.profileImage"
                        :src="getProfileImageUrl(selectedContactPerson)!"
                        :alt="`Profilbild von ${selectedContactPerson.firstName} ${selectedContactPerson.lastName}`"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <span v-else class="text-3xl font-display text-vsg-blue-400">
                        {{ getInitials(selectedContactPerson) }}
                      </span>
                    </div>
                    <!-- Name and Role -->
                    <div>
                      <h2 class="font-display text-2xl tracking-wider text-vsg-blue-900">
                        {{ selectedContactPerson.firstName }}
                        {{ selectedContactPerson.lastName }}
                      </h2>
                      <span
                        class="inline-block mt-2 px-3 py-1 bg-vsg-gold-400 text-vsg-blue-900 text-sm font-body rounded-full"
                      >
                        {{ selectedContactPerson.type }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="space-y-4">
                  <!-- Phone -->
                  <div class="flex items-start gap-4">
                    <div
                      class="shrink-0 w-10 h-10 bg-vsg-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon="phone" class="text-vsg-blue-600" />
                    </div>
                    <div>
                      <span
                        class="block text-sm font-body text-vsg-blue-500 uppercase tracking-wider"
                        >Telefon</span
                      >
                      <SecureContact
                        :key="`phone-${selectedContactPerson.id}`"
                        :encrypted="encodeBase64(selectedContactPerson.phone)"
                        type="phone"
                        class="font-body text-lg text-vsg-blue-900 hover:text-vsg-gold-600 transition-colors"
                      />
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="flex items-start gap-4">
                    <div
                      class="shrink-0 w-10 h-10 bg-vsg-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon="envelope" class="text-vsg-blue-600" />
                    </div>
                    <div>
                      <span
                        class="block text-sm font-body text-vsg-blue-500 uppercase tracking-wider"
                        >E-Mail</span
                      >
                      <SecureContact
                        :key="`email-${selectedContactPerson.id}`"
                        :encrypted="encodeBase64(selectedContactPerson.email)"
                        class="font-body text-lg text-vsg-blue-900 hover:text-vsg-gold-600 transition-colors"
                      />
                    </div>
                  </div>

                  <!-- Address (if available) -->
                  <div v-if="selectedContactPerson.address" class="flex items-start gap-4">
                    <div
                      class="shrink-0 w-10 h-10 bg-vsg-blue-100 rounded-lg flex items-center justify-center"
                    >
                      <FontAwesomeIcon icon="location-dot" class="text-vsg-blue-600" />
                    </div>
                    <div>
                      <span
                        class="block text-sm font-body text-vsg-blue-500 uppercase tracking-wider"
                        >Adresse</span
                      >
                      <p class="font-body text-lg text-vsg-blue-900 whitespace-pre-line">
                        {{ selectedContactPerson.address }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Contact Form (shown when a contact person is selected) -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out delay-150"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-4"
            >
              <ContactForm
                v-if="selectedContactPerson"
                :key="selectedContactPerson.id"
                :contact-person-id="selectedContactPerson.id"
                :contact-person-name="`${selectedContactPerson.firstName} ${selectedContactPerson.lastName}`"
              />
            </Transition>

            <!-- Default Message when no selection -->
            <div
              v-if="!selectedContactPerson"
              class="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100"
            >
              <FontAwesomeIcon icon="users" class="mx-auto text-vsg-blue-200" />
              <p class="mt-4 font-body text-vsg-blue-500">
                Wähle eine Ansprechperson aus der Liste, um die Kontaktdaten anzuzeigen.
              </p>
            </div>
          </div>
        </ApiState>
      </div>
    </section>
  </div>
</template>
