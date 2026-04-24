<script setup lang="ts">
import { DepartmentLocation } from "@vsg/types";
import EditableContent from "@/components/content/EditableContent.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";
import LocationCard from "./LocationCard.vue";

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

const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section class="relative py-32" :class="sectionBackgroundClass">
    <div class="mx-auto max-w-7xl px-6">
      <!-- Section Header -->
      <div class="flex flex-col gap-6">
        <SectionHeader
          :subtitle="props.subtitle"
          :title="props.title"
          subtitle-uuid="location-section-subtitle"
          title-uuid="location-section-title"
        />
        <EditableContent
          v-if="props.description"
          uuid="location-section-description"
          :content="props.description"
          tag="p"
          content-class="mx-auto max-w-3xl text-center font-body text-lg text-gray-600"
        />
      </div>

      <!-- Locations Grid -->
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
    </div>
  </section>
</template>
