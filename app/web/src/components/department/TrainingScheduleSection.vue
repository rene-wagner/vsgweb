<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { DepartmentTrainingGroup } from "@vsg/types";
import EditableContent from "@/components/content/EditableContent.vue";
import SectionHeader from "@/components/ui/SectionHeader.vue";
import { useSectionBackground, type SectionBackground } from "@/composables/useSectionBackground";
import TrainingTable from "./TrainingTable.vue";

interface Props {
  title: string;
  subtitle: string;
  description?: string;
  groups: DepartmentTrainingGroup[];
  background?: SectionBackground;
}

const props = withDefaults(defineProps<Props>(), {
  background: "white",
});

function getHeaderClasses(variant: DepartmentTrainingGroup["variant"]): string {
  return variant === "primary" ? "bg-vsg-blue-600" : "bg-vsg-blue-900";
}

function getIconBgClasses(variant: DepartmentTrainingGroup["variant"]): string {
  return variant === "primary" ? "bg-white/20" : "bg-vsg-gold-400/20";
}

function getIconClasses(variant: DepartmentTrainingGroup["variant"]): string {
  return variant === "primary" ? "text-white" : "text-vsg-gold-400";
}

function getAgeRangeClasses(variant: DepartmentTrainingGroup["variant"]): string {
  return variant === "primary" ? "text-vsg-blue-100" : "text-vsg-blue-300";
}

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
          subtitle-uuid="training-schedule-subtitle"
          title-uuid="training-schedule-title"
        />
        <EditableContent
          v-if="props.description"
          uuid="training-schedule-description"
          :content="props.description"
          tag="p"
          content-class="mx-auto max-w-3xl text-center font-body text-lg text-gray-600"
        />
      </div>

      <!-- Training Groups Grid -->
      <div
        :class="['mt-16 gap-12', props.groups.length === 1 ? 'flex justify-center' : 'grid lg:grid-cols-2']"
      >
        <div
          v-for="group in props.groups"
          :key="group.name"
          :class="[
            'card-hover overflow-hidden rounded-xl border border-gray-200 bg-gray-50',
            { 'w-full max-w-2xl': props.groups.length === 1 },
          ]"
        >
          <!-- Card Header -->
          <div :class="[getHeaderClasses(group.variant), 'px-8 py-6']">
            <div class="flex items-center gap-4">
              <div
                :class="[
                  getIconBgClasses(group.variant),
                  'flex h-14 w-14 items-center justify-center rounded-lg',
                ]"
              >
                <!-- Youth Icon -->
                <FontAwesomeIcon
                  v-if="group.icon === 'youth'"
                  icon="child"
                  :class="[getIconClasses(group.variant)]"
                />
                <!-- Adults Icon -->
                <FontAwesomeIcon
                  v-else-if="group.icon === 'adults'"
                  icon="person"
                  :class="[getIconClasses(group.variant)]"
                />
              </div>
              <div>
                <h3 class="font-display text-3xl tracking-wider text-white">
                  {{ group.name.toUpperCase() }}
                </h3>
                <span :class="[getAgeRangeClasses(group.variant), 'font-body font-normal']">
                  {{ group.ageRange }}
                </span>
              </div>
            </div>
          </div>

          <!-- Schedule Table -->
          <div class="p-8">
            <TrainingTable :sessions="group.sessions" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
