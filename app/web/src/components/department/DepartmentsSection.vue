<script setup lang="ts">
import { storeToRefs } from "pinia";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import DepartmentCard from "./DepartmentCard.vue";
import { useDepartmentsStore } from "../../stores/departmentsStore";

interface Props {
  headline?: string;
  description?: string;
  subtitle?: string;
}

const props = defineProps<Props>();

const departmentsStore = useDepartmentsStore();
const { departments, isLoading, error } = storeToRefs(departmentsStore);
</script>

<template>
  <section class="relative bg-white py-32">
    <div class="mx-auto max-w-7xl px-6">
      <SectionHeader :subtitle="props.subtitle || ''" :title="props.headline || ''" class="mb-6" />
      <p
        v-if="props.description"
        class="mx-auto mt-6 mb-16 max-w-3xl text-center font-body text-lg text-gray-600"
      >
        {{ props.description }}
      </p>

      <ApiState
        :is-loading="isLoading"
        :error="error"
        :empty="departments.length === 0"
        empty-message="Derzeit sind keine Abteilungen verfugbar."
      >
        <div class="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <DepartmentCard
            v-for="department in departments"
            :key="department.id"
            :title="department.name.toUpperCase()"
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
