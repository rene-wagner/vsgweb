<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import Logo from "./Logo.vue";

const foundingDate = new Date("1985-05-10");

const vereinLinks = [
  { label: "Geschichte", to: "/verein/geschichte" },
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
</script>

<template>
  <footer class="border-t border-vsg-gold-400/20 bg-vsg-blue-900 py-16">
    <div class="mx-auto max-w-7xl px-6">
      <div class="grid gap-12 md:grid-cols-4">
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
        <div class="md:col-start-4 md:text-right">
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
