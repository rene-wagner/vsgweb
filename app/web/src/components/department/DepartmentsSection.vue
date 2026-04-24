<script setup lang="ts">
import { storeToRefs } from "pinia";
import ApiState from "@/components/ui/ApiState.vue";
import Section from "@/components/ui/Section.vue";
import type { SectionBackground } from "@/composables/useSectionBackground";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import DepartmentCard from "./DepartmentCard.vue";
import { useDepartmentsStore } from "../../stores/departmentsStore";

interface Props {
  headline?: string;
  description?: string;
  subtitle?: string;
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  background: "white",
});

const departmentsStore = useDepartmentsStore();
const { departments, isLoading, error } = storeToRefs(departmentsStore);
</script>

<template>
  <Section
    :subtitle="props.subtitle || ''"
    :title="props.headline || ''"
    subtitle-uuid="departments-subtitle"
    title-uuid="departments-title"
    :description="props.description"
    description-uuid="departments-description"
    description-tag="p"
    :background="props.background"
  >
      <ApiState
        class="mt-16"
        :is-loading="isLoading"
        :error="error"
        :empty="departments.length === 0"
        empty-message="Derzeit sind keine Abteilungen verfugbar."
      >
        <div class="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
          <DepartmentCard
            v-for="department in departments"
            :key="department.id"
            :title="department.name"
            :description="department.shortDescription"
            :href="`/abteilung/${department.slug}`"
          >
            <template #icon>
              <img
                v-if="department.icon"
                :src="getMediaUrl(department.icon)"
                :alt="department.name"
                class="h-8 w-8 object-contain"
                style="
                  filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(200deg) brightness(89%)
                    contrast(91%);
                "
              />
              <FontAwesomeIcon v-else icon="circle" class="text-vsg-blue-600" />
            </template>
          </DepartmentCard>
        </div>
      </ApiState>
  </Section>
</template>
