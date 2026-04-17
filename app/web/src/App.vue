<script setup lang="ts">
import { onErrorCaptured, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import Navbar from "@/components/app/Navbar.vue";
import Footer from "@/components/app/Footer.vue";
import CookieConsentBanner from "@/components/app/CookieConsentBanner.vue";
import { useCategoriesStore } from "@/stores/categoriesStore";
import { useContactPeopleStore } from "@/stores/contactPeopleStore";
import { useDepartmentsStore } from "@/stores/departmentsStore";
import { usePostsStore } from "@/stores/postsStore";
import { getApiErrorMessage } from "@/lib/sdk";

const categoriesStore = useCategoriesStore();
const contactPeopleStore = useContactPeopleStore();
const departmentsStore = useDepartmentsStore();
const postsStore = usePostsStore();
const { error: categoriesError } = storeToRefs(categoriesStore);
const { error: contactPeopleError } = storeToRefs(contactPeopleStore);
const { error: departmentsError } = storeToRefs(departmentsStore);
const { error: postsError } = storeToRefs(postsStore);

const isInitializing = ref(true);
const initializationError = ref<string | null>(null);
const runtimeError = ref<string | null>(null);

async function initializeApp(): Promise<void> {
  isInitializing.value = true;
  initializationError.value = null;
  runtimeError.value = null;

  try {
    await Promise.all([
      categoriesStore.fetchCategories(),
      contactPeopleStore.fetchContactPeople(),
      departmentsStore.fetchDepartments(),
      postsStore.fetchPublishedPosts(),
    ]);
  } catch (error) {
    console.error("[VSG] App initialization error", error);
    initializationError.value =
      categoriesError.value ??
      contactPeopleError.value ??
      departmentsError.value ??
      postsError.value ??
      "Die App konnte nicht gestartet werden.";
  } finally {
    isInitializing.value = false;
  }
}

onMounted(() => {
  void initializeApp();
});

onErrorCaptured((error) => {
  console.error("[VSG] Captured component error", error);
  runtimeError.value = getApiErrorMessage(error, "Die App konnte nicht dargestellt werden.");
  return false;
});

function reloadApp(): void {
  window.location.reload();
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-vsg-blue-900 text-white">
    <div v-if="isInitializing" class="flex min-h-screen items-center justify-center px-6">
      <div class="flex max-w-md flex-col items-center text-center">
        <FontAwesomeIcon icon="spinner" class="mb-6 text-4xl text-vsg-gold-400 animate-spin" />
        <p class="font-display text-3xl tracking-wider text-vsg-gold-400">VSG KUGELBERG</p>
        <p class="mt-4 font-body text-lg text-vsg-blue-200">
          Wichtige Vereinsdaten werden geladen.
        </p>
      </div>
    </div>

    <div v-else-if="initializationError" class="flex min-h-screen items-center justify-center px-6">
      <div
        class="w-full max-w-lg border border-vsg-gold-400/20 bg-vsg-blue-900/80 p-10 text-center shadow-2xl backdrop-blur"
      >
        <FontAwesomeIcon icon="triangle-exclamation" class="text-4xl text-vsg-gold-400" />
        <h1 class="mt-6 font-display text-3xl tracking-wider text-vsg-gold-400">
          Start fehlgeschlagen
        </h1>
        <p class="mt-4 font-body text-lg text-vsg-blue-200">
          {{ initializationError }}
        </p>
        <button
          type="button"
          class="mt-8 bg-vsg-gold-400 px-6 py-3 font-display text-lg tracking-wider text-vsg-blue-900 transition-colors hover:bg-vsg-gold-300"
          @click="initializeApp"
        >
          Erneut versuchen
        </button>
      </div>
    </div>

    <div v-else-if="runtimeError" class="flex min-h-screen items-center justify-center px-6">
      <div
        class="w-full max-w-lg border border-vsg-gold-400/20 bg-vsg-blue-900/80 p-10 text-center shadow-2xl backdrop-blur"
      >
        <FontAwesomeIcon icon="triangle-exclamation" class="text-4xl text-vsg-gold-400" />
        <h1 class="mt-6 font-display text-3xl tracking-wider text-vsg-gold-400">
          Unerwarteter Fehler
        </h1>
        <p class="mt-4 font-body text-lg text-vsg-blue-200">
          {{ runtimeError }}
        </p>
        <button
          type="button"
          class="mt-8 bg-vsg-gold-400 px-6 py-3 font-display text-lg tracking-wider text-vsg-blue-900 transition-colors hover:bg-vsg-gold-300"
          @click="reloadApp"
        >
          Neu laden
        </button>
      </div>
    </div>

    <template v-else>
      <Navbar />
      <main>
        <router-view />
      </main>
      <Footer />
      <CookieConsentBanner />
    </template>
  </div>
</template>
