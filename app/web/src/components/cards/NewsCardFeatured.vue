<script setup lang="ts">
import Badge from "@/components/ui/Badge.vue";
import { RouterLink } from "vue-router";

interface Props {
  category: string;
  date: string;
  title: string;
  to?: string;
}

withDefaults(defineProps<Props>(), {
  to: "/",
});
</script>

<template>
  <RouterLink :to="to" class="card-hover group overflow-hidden bg-vsg-blue-600">
    <div class="relative aspect-video overflow-hidden bg-vsg-blue-700">
      <div class="absolute inset-0 bg-linear-to-t from-vsg-blue-600 to-transparent" />
      <div class="absolute bottom-4 left-4">
        <Badge accent-class="border-vsg-gold-400 bg-vsg-gold-400 text-vsg-blue-900">
          {{ category }}
        </Badge>
      </div>
    </div>
    <div class="p-8">
      <span class="font-body text-sm font-normal text-vsg-blue-200">
        {{ date }}
      </span>
      <h4
        class="mb-4 mt-2 font-display text-3xl tracking-wider text-white transition-colors group-hover:text-vsg-gold-400"
      >
        {{ title }}
      </h4>
    </div>
  </RouterLink>
</template>
