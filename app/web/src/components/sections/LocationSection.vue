<script setup lang="ts">
import { DepartmentLocation } from "@vsg/types";
import Section from "@/components/sections/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";
import LocationCard from "@/components/ui/LocationCard.vue";

interface Props {
  title: string;
  subtitle: string;
  description?: string;
  locations: DepartmentLocation[];
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  background: "white",
});
</script>

<template>
  <Section
    :subtitle="props.subtitle"
    :title="props.title"
    subtitle-uuid="location-section-subtitle"
    title-uuid="location-section-title"
    :description="props.description"
    description-uuid="location-section-description"
    description-tag="p"
    :background="props.background"
  >
    <div
      :class="[
        'mt-16 gap-8',
        props.locations.length === 1 ? 'flex justify-center' : 'grid md:grid-cols-2',
      ]"
    >
      <LocationCard
        v-for="location in props.locations"
        :key="location.name"
        :location="location"
        :class="{ 'w-full max-w-2xl': props.locations.length === 1 }"
      />
    </div>
  </Section>
</template>
