<script setup lang="ts">
import { computed } from "vue";
import type { DepartmentColor } from "@vsg/types";

interface Props {
  iconUrl?: string;
  alt: string;
  color: DepartmentColor;
}

const props = defineProps<Props>();

const backgroundClass = computed(() => {
  switch (props.color) {
    case "purple":
      return "bg-vsg-badminton-secondary";
    case "green":
      return "bg-vsg-gymnastik-secondary";
    case "red":
      return "bg-vsg-tischtennis-secondary";
    case "blue":
    default:
      return "bg-vsg-volleyball-secondary";
  }
});
</script>

<template>
  <div
    :class="[
      backgroundClass,
      'flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#fef9c3]/20 shadow-[0_0_36px_rgba(251,191,36,0.2)]',
    ]"
  >
    <img v-if="iconUrl" :src="iconUrl" :alt="alt" class="h-full w-full object-contain" />
    <FontAwesomeIcon v-else icon="circle" class="text-xl text-vsg-blue-900" />
  </div>
</template>
