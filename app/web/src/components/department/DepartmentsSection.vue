<script setup lang="ts">
import { storeToRefs } from "pinia";
import EditableContent from "@/components/content/EditableContent.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";
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
const sectionBackgroundClass = useSectionBackground(() => props.background);
</script>

<template>
  <section class="relative py-32" :class="sectionBackgroundClass">
    <div class="mx-auto flex max-w-7xl flex-col px-6">
      <div class="flex flex-col gap-6">
        <SectionHeader
          :subtitle="props.subtitle || ''"
          :title="props.headline || ''"
          subtitle-uuid="departments-subtitle"
          title-uuid="departments-title"
        />
        <EditableContent
          v-if="props.description"
          uuid="departments-description"
          :content="props.description"
          tag="p"
          content-class="mx-auto max-w-3xl text-center font-body text-lg text-gray-600"
        />
      </div>

      <ApiState
        class="mt-16"
        :is-loading="isLoading"
        :error="error"
        :empty="departments.length === 0"
        empty-message="Derzeit sind keine Abteilungen verfugbar."
      >
        <div class="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
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
    </div>
  </section>
</template>
