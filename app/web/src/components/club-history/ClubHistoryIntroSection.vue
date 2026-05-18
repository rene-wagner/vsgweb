<script setup lang="ts">
import { computed } from "vue";
import type { ApiClubHistory } from "@vsg/types";
import Section from "@/components/sections/Section.vue";

interface Props {
  history: ApiClubHistory;
}

const props = defineProps<Props>();

const foundingDate = computed(() => new Date(props.history.foundingDate));
const foundingDateLabel = computed(() =>
  new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(foundingDate.value),
);

const clubAge = computed(() => {
  const today = new Date();
  let years = today.getFullYear() - foundingDate.value.getFullYear();
  const monthDiff = today.getMonth() - foundingDate.value.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < foundingDate.value.getDate())) {
    years -= 1;
  }

  return years;
});

const latestMembership = computed(() => {
  const stats = [...props.history.membershipStats].sort((a, b) => a.year - b.year);
  return stats.length > 0 ? stats[stats.length - 1] : null;
});

const milestoneCount = computed(() => props.history.milestones.length);
</script>

<template>
  <Section
    subtitle="Seit 1985 in Bewegung"
    title="Ein Verein mit Haltung, Herz und Heimat"
    subtitle-uuid="4c6b9d95-2c53-4db4-8f27-5b0fc97f7aa1"
    title-uuid="0ebfd2e7-4f8d-4f99-9df3-1dcf90ac5f72"
    description="Aus kleinen Anfängen in Weißenfels ist über Jahrzehnte ein vielseitiger Verein gewachsen. Unsere Geschichte erzählt von Zusammenhalt, neuen Abteilungen, sportlichen Erfolgen und Menschen, die den Verein mit Leben füllen."
    description-uuid="f3c39f19-7f89-4684-b6e5-7fdd2be0b3c8"
    background="white"
  >
    <div class="mt-16 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
      <div class="rounded-md border border-vsg-gold-400/20 bg-vsg-blue-600 p-8 text-white shadow-sm">
        <p class="font-body text-sm uppercase tracking-[0.3em] text-vsg-gold-300">Gründung</p>
        <p class="mt-4 font-display text-5xl tracking-wider text-vsg-gold-400 md:text-6xl">
          {{ foundingDateLabel }}
        </p>
        <p class="mt-6 max-w-2xl font-body text-lg leading-relaxed text-vsg-blue-100">
          Seit über {{ clubAge }} Jahren steht die VSG Kugelberg für Bewegung, Gemeinschaft und
          sportliche Entwicklung. Aus einer einzelnen Sportstätte entstand Schritt für Schritt ein
          Verein, der heute mehrere Sportarten unter einem Dach vereint.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <div class="rounded-md border border-vsg-blue-100 bg-vsg-blue-50 p-6 shadow-sm">
          <p class="font-body text-sm uppercase tracking-[0.25em] text-vsg-blue-600">Jahre</p>
          <p class="mt-3 font-display text-5xl text-vsg-blue-900">{{ clubAge }}</p>
          <p class="mt-2 font-body text-base text-vsg-blue-700">lebendige Vereinsgeschichte</p>
        </div>

        <div class="rounded-md border border-vsg-blue-100 bg-white p-6 shadow-sm">
          <p class="font-body text-sm uppercase tracking-[0.25em] text-vsg-blue-600">
            Meilensteine
          </p>
          <p class="mt-3 font-display text-5xl text-vsg-blue-900">{{ milestoneCount }}</p>
          <p class="mt-2 font-body text-base text-vsg-blue-700">
            prägende Stationen seit der Gründung
          </p>
        </div>

        <div class="rounded-md border border-vsg-gold-200 bg-vsg-gold-50 p-6 shadow-sm">
          <p class="font-body text-sm uppercase tracking-[0.25em] text-vsg-blue-600">Mitglieder</p>
          <p class="mt-3 font-display text-5xl text-vsg-blue-900">
            {{ latestMembership?.memberCount ?? "–" }}
          </p>
          <p class="mt-2 font-body text-base text-vsg-blue-700">
            Stand {{ latestMembership?.year ?? "aktuell" }}
          </p>
        </div>
      </div>
    </div>
  </Section>
</template>
