<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import Logo from "./Logo.vue";
import { useDepartmentsStore } from "@/stores/departmentsStore";
import { useEditingMode } from "@/composables/useEditingMode";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface MenuItem {
  label: string;
  to: string;
}

interface DepartmentSectionItem {
  label: string;
  hash: string;
}

interface DepartmentMenuItem extends MenuItem {
  slug: string;
  sections: DepartmentSectionItem[];
}

const isMenuOpen = ref(false);
const isVereinOpen = ref(false);
const isAbteilungenOpen = ref(false);
const openMobileDepartmentSlug = ref<string | null>(null);

const departmentsStore = useDepartmentsStore();
const { departments, isLoading: departmentsLoading } = storeToRefs(departmentsStore);
const { isEditingMode, isCheckingEditingMode } = useEditingMode();

const vereinItems: MenuItem[] = [
  { label: "Vorstand", to: "/verein/vorstand" },
  { label: "Satzung", to: "/verein/satzung" },
  { label: "Beitragsordnung", to: "/verein/beitragsordnung" },
  { label: "Sportversicherung", to: "/verein/sportversicherung" },
];

const departmentSectionItems: DepartmentSectionItem[] = [
  { label: "Willkommen", hash: "#willkommen" },
  { label: "Zahlen & Fakten", hash: "#zahlen-fakten" },
  { label: "Trainingszeiten", hash: "#trainingszeiten" },
  { label: "Standorte", hash: "#standorte" },
  { label: "Neuigkeiten", hash: "#neuigkeiten" },
  { label: "Ergebnisse", hash: "#ergebnisse" },
  { label: "Galerie", hash: "#galerie" },
];

const abteilungenItems = computed<DepartmentMenuItem[]>(() => {
  const items = Array.isArray(departments.value) ? departments.value : [];

  return items.map((dept) => ({
    label: dept.name,
    slug: dept.slug,
    to: `/abteilung/${dept.slug}`,
    sections: departmentSectionItems.filter(
      (section) => section.hash !== "#ergebnisse" || dept.departmentResults.length > 0,
    ),
  }));
});

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
  isVereinOpen.value = false;
  isAbteilungenOpen.value = false;
  openMobileDepartmentSlug.value = null;
}

function toggleVerein() {
  isVereinOpen.value = !isVereinOpen.value;
}

function toggleAbteilungen() {
  isAbteilungenOpen.value = !isAbteilungenOpen.value;
}

function toggleMobileDepartment(slug: string) {
  openMobileDepartmentSlug.value = openMobileDepartmentSlug.value === slug ? null : slug;
}

function handleDesktopDropdownNavigation(event: MouseEvent) {
  const target = event.currentTarget;

  if (target instanceof HTMLElement) {
    target.blur();
  }
}
</script>

<template>
  <nav
    class="fixed left-0 right-0 top-0 z-50 border-b border-vsg-gold-400/20 bg-vsg-blue-900/90 backdrop-blur-md"
  >
    <div class="mx-auto max-w-7xl px-6 py-4">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="flex items-center">
          <Logo class="h-12" />
        </RouterLink>

        <div class="hidden items-center gap-8 md:flex">
          <div class="group/abteilungen relative">
            <button
              type="button"
              class="flex items-center gap-1 font-body text-sm font-normal uppercase tracking-wider text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
              aria-haspopup="true"
            >
              Abteilungen
              <FontAwesomeIcon
                icon="chevron-down"
                class="transition-transform group-hover/abteilungen:rotate-180"
              />
            </button>
            <div
              class="invisible absolute left-0 top-full mt-2 w-56 translate-y-2 transform rounded-lg border border-vsg-gold-400/20 bg-vsg-blue-900 opacity-0 shadow-xl transition-all duration-200 group-focus-within/abteilungen:visible group-focus-within/abteilungen:translate-y-0 group-focus-within/abteilungen:opacity-100 group-hover/abteilungen:visible group-hover/abteilungen:translate-y-0 group-hover/abteilungen:opacity-100"
            >
              <div class="py-2">
                <div v-if="departmentsLoading" class="px-4 py-2 text-sm text-vsg-gold-300/60">
                  Laden...
                </div>
                <div
                  v-else-if="abteilungenItems.length === 0"
                  class="px-4 py-2 text-sm text-vsg-gold-300/60"
                >
                  Keine Abteilungen
                </div>
                <template v-else>
                  <div
                    v-for="item in abteilungenItems"
                    :key="item.to"
                    class="group/department relative"
                  >
                    <div
                      class="flex items-center justify-between gap-3 px-4 py-2 transition-colors hover:bg-vsg-blue-800/50"
                    >
                      <RouterLink
                        :to="item.to"
                        class="min-w-0 flex-1 font-body text-sm font-normal text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
                        @click="handleDesktopDropdownNavigation"
                      >
                        {{ item.label }}
                      </RouterLink>
                      <FontAwesomeIcon
                        v-if="item.sections.length > 0"
                        icon="chevron-right"
                        class="text-xs text-vsg-gold-300/80 transition-colors group-hover/department:text-vsg-gold-400"
                      />
                    </div>

                    <div
                      v-if="item.sections.length > 0"
                      class="invisible pointer-events-none absolute left-full top-0 ml-1 w-56 translate-x-2 rounded-lg border border-vsg-gold-400/20 bg-vsg-blue-900 opacity-0 shadow-xl transition-all duration-200 group-focus-within/department:visible group-focus-within/department:pointer-events-auto group-focus-within/department:translate-x-0 group-focus-within/department:opacity-100 group-hover/department:visible group-hover/department:pointer-events-auto group-hover/department:translate-x-0 group-hover/department:opacity-100"
                    >
                      <div class="py-2">
                        <RouterLink
                          v-for="section in item.sections"
                          :key="`${item.slug}-${section.hash}`"
                          :to="{ path: item.to, hash: section.hash }"
                          class="block px-4 py-2 font-body text-sm font-normal text-vsg-gold-300 transition-colors hover:bg-vsg-blue-800/50 hover:text-vsg-gold-400"
                          @click="handleDesktopDropdownNavigation"
                        >
                          {{ section.label }}
                        </RouterLink>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <div class="group relative">
            <button
              type="button"
              class="flex items-center gap-1 font-body text-sm font-normal uppercase tracking-wider text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
              aria-haspopup="true"
            >
              Verein
              <FontAwesomeIcon
                icon="chevron-down"
                class="transition-transform group-hover:rotate-180"
              />
            </button>
            <div
              class="invisible absolute left-0 top-full mt-2 w-48 translate-y-2 transform rounded-lg border border-vsg-gold-400/20 bg-vsg-blue-900 opacity-0 shadow-xl transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
            >
              <div class="py-2">
                <RouterLink
                  v-for="item in vereinItems"
                  :key="item.label"
                  :to="item.to"
                  class="block px-4 py-2 font-body text-sm font-normal text-vsg-gold-300 transition-colors hover:bg-vsg-blue-800/50 hover:text-vsg-gold-400"
                  @click="handleDesktopDropdownNavigation"
                >
                  {{ item.label }}
                </RouterLink>
              </div>
            </div>
          </div>

          <RouterLink
            to="/beitraege"
            class="font-body text-sm font-normal uppercase tracking-wider text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
          >
            Beiträge
          </RouterLink>

          <RouterLink
            to="/termine"
            class="font-body text-sm font-normal uppercase tracking-wider text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
          >
            Termine
          </RouterLink>

          <RouterLink
            to="/kontakt"
            class="font-body text-sm font-normal uppercase tracking-wider text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
          >
            Kontakt
          </RouterLink>

          <RouterLink
            to="/verein/aufnahmeantrag"
            class="bg-vsg-gold-400 px-4 py-2 font-display text-sm tracking-wider text-vsg-blue-900 transition-colors hover:bg-vsg-gold-300"
          >
            Mitglied werden
          </RouterLink>

          <div
            v-if="!isCheckingEditingMode && isEditingMode"
            class="flex items-center justify-end text-vsg-gold-300"
            aria-label="Bearbeitungsmodus aktiv"
            title="Im Bearbeitungsmodus"
          >
            <FontAwesomeIcon icon="pen" class="text-base" />
          </div>
        </div>

        <div class="flex items-center gap-4 md:hidden">
          <div
            v-if="!isCheckingEditingMode && isEditingMode"
            class="flex items-center gap-2 text-vsg-gold-300"
            aria-label="Bearbeitungsmodus aktiv"
          >
            <FontAwesomeIcon icon="pen" class="text-sm" />
            <span class="font-body text-sm font-semibold">Im Bearbeitungsmodus</span>
          </div>

          <button
            id="mobile-menu-toggle"
            class="group flex h-10 w-10 flex-col items-center justify-center gap-1.5"
            :aria-label="isMenuOpen ? 'Menü schließen' : 'Menü öffnen'"
            :aria-expanded="isMenuOpen"
            aria-controls="mobile-menu"
            @click="toggleMenu"
          >
            <span
              class="h-0.5 w-6 bg-vsg-gold-400 transition-all duration-300 group-hover:bg-vsg-gold-300"
              :class="{
                'translate-y-2 rotate-45': isMenuOpen,
              }"
            />
            <span
              class="h-0.5 w-6 bg-vsg-gold-400 transition-all duration-300 group-hover:bg-vsg-gold-300"
              :class="{ 'opacity-0': isMenuOpen }"
            />
            <span
              class="h-0.5 w-6 bg-vsg-gold-400 transition-all duration-300 group-hover:bg-vsg-gold-300"
              :class="{
                '-translate-y-2 -rotate-45': isMenuOpen,
              }"
            />
          </button>
        </div>
      </div>
    </div>
  </nav>

  <div
    id="mobile-menu"
    class="fixed inset-0 z-40 overflow-y-scroll bg-vsg-blue-900 transition-transform duration-300 ease-in-out md:hidden"
    :class="isMenuOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex min-h-full flex-col items-center gap-6 px-8 pb-12 pt-28">
      <div class="flex w-full max-w-xs flex-col">
        <button
          class="flex w-full items-center justify-between font-display text-4xl tracking-wider text-white transition-colors hover:text-vsg-gold-400"
          @click="toggleAbteilungen"
        >
          <span>Abteilungen</span>
          <FontAwesomeIcon
            icon="chevron-down"
            class="shrink-0 transition-transform duration-300"
            :class="{ 'rotate-180': isAbteilungenOpen }"
          />
        </button>
        <div
          class="mt-4 flex flex-col gap-3 overflow-hidden pl-4 transition-all duration-300"
          :style="{ maxHeight: isAbteilungenOpen ? '1200px' : '0' }"
        >
          <span v-if="departmentsLoading" class="text-lg text-vsg-gold-300/60"> Laden... </span>
          <span v-else-if="abteilungenItems.length === 0" class="text-lg text-vsg-gold-300/60">
            Keine Abteilungen
          </span>
          <template v-else>
            <div v-for="item in abteilungenItems" :key="item.to" class="flex flex-col gap-3">
              <button
                class="flex w-full items-center justify-between gap-4 font-body text-left text-lg font-normal text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
                @click="toggleMobileDepartment(item.slug)"
              >
                <span>{{ item.label }}</span>
                <FontAwesomeIcon
                  icon="chevron-down"
                  class="shrink-0 text-sm transition-transform duration-300"
                  :class="{ 'rotate-180': openMobileDepartmentSlug === item.slug }"
                />
              </button>

              <div
                class="flex flex-col gap-3 overflow-hidden border-l border-vsg-gold-400/20 pl-4 transition-all duration-300"
                :style="{ maxHeight: openMobileDepartmentSlug === item.slug ? '600px' : '0' }"
              >
                <RouterLink
                  v-for="section in item.sections"
                  :key="`${item.slug}-${section.hash}`"
                  :to="{ path: item.to, hash: section.hash }"
                  class="font-body text-base font-normal text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
                  @click="closeMenu"
                >
                  {{ section.label }}
                </RouterLink>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="flex w-full max-w-xs flex-col">
        <button
          class="flex w-full items-center justify-between font-display text-4xl tracking-wider text-white transition-colors hover:text-vsg-gold-400"
          @click="toggleVerein"
        >
          <span>Verein</span>
          <FontAwesomeIcon
            icon="chevron-down"
            class="shrink-0 transition-transform duration-300"
            :class="{ 'rotate-180': isVereinOpen }"
          />
        </button>
        <div
          class="mt-4 flex flex-col gap-3 overflow-hidden pl-4 transition-all duration-300"
          :style="{ maxHeight: isVereinOpen ? '300px' : '0' }"
        >
          <RouterLink
            v-for="item in vereinItems"
            :key="item.label"
            :to="item.to"
            class="font-body text-lg font-normal text-vsg-gold-300 transition-colors hover:text-vsg-gold-400"
            @click="closeMenu"
          >
            {{ item.label }}
          </RouterLink>
        </div>
      </div>

      <div class="mb-4 w-full max-w-xs">
        <RouterLink
          to="/beitraege"
          class="block font-display text-4xl tracking-wider text-white transition-colors hover:text-vsg-gold-400"
          @click="closeMenu"
          >Beiträge</RouterLink
        >
      </div>

      <div class="mb-4 w-full max-w-xs">
        <RouterLink
          to="/termine"
          class="block font-display text-4xl tracking-wider text-white transition-colors hover:text-vsg-gold-400"
          @click="closeMenu"
          >Termine</RouterLink
        >
      </div>

      <div class="mb-4 w-full max-w-xs">
        <RouterLink
          to="/kontakt"
          class="block font-display text-4xl tracking-wider text-white transition-colors hover:text-vsg-gold-400"
          @click="closeMenu"
          >Kontakt</RouterLink
        >
      </div>

      <div class="mt-4 w-full max-w-xs">
        <RouterLink
          to="/verein/aufnahmeantrag"
          class="block bg-vsg-gold-400 px-6 py-4 text-center font-display text-2xl tracking-wider text-vsg-blue-900 transition-colors hover:bg-vsg-gold-300"
          @click="closeMenu"
        >
          Mitglied werden
        </RouterLink>
      </div>
    </div>
  </div>
</template>
