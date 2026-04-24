<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import type { DepartmentLocation } from "@vsg/types";

interface Props {
  location: DepartmentLocation;
}

defineProps<Props>();
</script>

<template>
  <div class="card-hover overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div v-if="location.picture" class="aspect-video relative">
      <img
        :src="getMediaUrl(location.picture)"
        :alt="location.picture.original_filename || location.name"
        class="h-full w-full object-cover"
      />
    </div>

    <!-- Location Details -->
    <div class="p-8">
      <h3 class="mb-2 font-display text-2xl tracking-wider text-vsg-blue-900">
        {{ location.name }}
      </h3>

      <div class="mb-6">
        <div class="flex items-start gap-3">
          <FontAwesomeIcon icon="location-dot" class="mt-0.5 text-vsg-blue-600" />
          <div>
            <p class="font-body font-semibold text-vsg-blue-800">
              {{ location.street }}
            </p>
            <p class="font-body text-gray-600">{{ location.city }}</p>
          </div>
        </div>
      </div>

      <!-- Route Link -->
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
    </div>
  </div>
</template>
