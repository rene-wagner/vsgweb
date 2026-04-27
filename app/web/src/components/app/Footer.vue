<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";
import Logo from "./Logo.vue";
import { useDepartmentsStore } from "@/stores/departmentsStore";

const foundingDate = new Date("1985-05-10");
const departmentsStore = useDepartmentsStore();
const { departments, isLoading: departmentsLoading } = storeToRefs(departmentsStore);

const generalLinks = [
  { label: "Beiträge", to: "/beitraege" },
  { label: "Kontakt", to: "/kontakt" },
];

const vereinLinks = [
  { label: "Vorstand", to: "/verein/vorstand" },
  { label: "Satzung", to: "/verein/satzung" },
  { label: "Beitragsordnung", to: "/verein/beitragsordnung" },
  { label: "Sportversicherung", to: "/verein/sportversicherung" },
  { label: "Mitgliedschaft", to: "/verein/mitgliedschaft" },
];

const age = computed(() => {
  const today = new Date();
  let years = today.getFullYear() - foundingDate.getFullYear();
  const monthDiff = today.getMonth() - foundingDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < foundingDate.getDate())) {
    years--;
  }

  return years;
});

const departmentLinks = computed(() => {
  const items = Array.isArray(departments.value) ? departments.value : [];

  return items.map((department) => ({
    label: department.name,
    to: `/abteilung/${department.slug}`,
  }));
});
</script>

<template>
  <footer class="border-t border-vsg-gold-400/20 bg-vsg-blue-900 py-16">
    <div class="mx-auto max-w-7xl px-6">
      <div class="grid gap-12 md:grid-cols-5">
        <!-- Brand -->
        <div class="md:col-span-2">
          <div class="mb-6">
            <Logo class="h-20 md:h-32" />
          </div>
          <p class="max-w-md font-body font-normal leading-relaxed text-vsg-blue-300">
            Seit über {{ age }} Jahren der Sportverein für Weißenfels und Umgebung. Tradition,
            Gemeinschaft und sportliche Exzellenz.
          </p>
        </div>

        <!-- Links -->
        <div class="md:col-start-3 md:text-right">
          <h5 class="mb-6 font-display text-xl tracking-wider text-vsg-gold-400">Allgemeines</h5>
          <ul class="space-y-3">
            <li v-for="link in generalLinks" :key="link.label">
              <RouterLink
                :to="link.to"
                class="font-body font-normal text-vsg-blue-300 transition-colors hover:text-vsg-gold-400"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="md:col-start-4 md:text-right">
          <h5 class="mb-6 font-display text-xl tracking-wider text-vsg-gold-400">Abteilungen</h5>
          <ul class="space-y-3">
            <li v-if="departmentsLoading" class="font-body font-normal text-vsg-blue-300/60">
              Laden...
            </li>
            <li
              v-else-if="departmentLinks.length === 0"
              class="font-body font-normal text-vsg-blue-300/60"
            >
              Keine Abteilungen
            </li>
            <li v-for="link in departmentLinks" v-else :key="link.to">
              <RouterLink
                :to="link.to"
                class="font-body font-normal text-vsg-blue-300 transition-colors hover:text-vsg-gold-400"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="md:col-start-5 md:text-right">
          <h5 class="mb-6 font-display text-xl tracking-wider text-vsg-gold-400">Verein</h5>
          <ul class="space-y-3">
            <li v-for="link in vereinLinks" :key="link.label">
              <RouterLink
                :to="link.to"
                class="font-body font-normal text-vsg-blue-300 transition-colors hover:text-vsg-gold-400"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-vsg-gold-400/10 pt-8 md:flex-row"
      >
        <span class="font-body text-sm font-normal text-vsg-blue-400">
          &copy; 2024 VSG Kugelberg e.V. Alle Rechte vorbehalten.
        </span>
        <div class="flex gap-6">
          <RouterLink
            to="/impressum"
            class="font-body text-sm font-normal text-vsg-blue-400 transition-colors hover:text-vsg-gold-400"
            >Impressum</RouterLink
          >
          <RouterLink
            to="/datenschutz"
            class="font-body text-sm font-normal text-vsg-blue-400 transition-colors hover:text-vsg-gold-400"
            >Datenschutz</RouterLink
          >
        </div>
      </div>
    </div>
  </footer>
</template>
