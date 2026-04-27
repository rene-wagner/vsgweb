<script setup lang="ts">
import { DepartmentLocation } from "@vsg/types";
import Card from "@/components/cards/Card.vue";
import Section from "@/components/sections/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

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
      <Card
        v-for="location in props.locations"
        :key="location.name"
        :title="location.name"
        :image-src="location.picture ? getMediaUrl(location.picture) : undefined"
        :image-alt="location.picture?.original_filename || location.name"
        background="white"
      >
        <template #title>
          <h3 class="mb-2 font-display text-2xl tracking-wider text-vsg-blue-900">
            {{ location.name }}
          </h3>
        </template>

        <div class="mb-6">
          <div class="flex items-start gap-2">
            <FontAwesomeIcon icon="location-dot" class="mt-0.5 text-vsg-blue-600" />
            <div class="flex gap-2">
              <span class="font-semibold text-vsg-blue-800">{{ location.street }}</span>
              <span class="text-gray-600">{{ location.city }}</span>
            </div>
          </div>
        </div>

        <template #link>
          <a
            v-if="location.mapsUrl"
            :href="location.mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-600 transition-colors hover:text-vsg-blue-800"
          >
            Route planen
            <FontAwesomeIcon icon="arrow-up-right-from-square" />
          </a>
        </template>
      </Card>
    </div>
  </Section>
</template>
