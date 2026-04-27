<script setup lang="ts">
import { computed } from "vue";
import Badge from "@/components/ui/Badge.vue";

interface Props {
  title?: string;
  description?: string;
  year?: string;
  categoryLabel?: string;
  categoryAccentClass?: string;
  icon?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageLayout?: "top" | "left";
  background?: "gray" | "white" | "blue";
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  description: undefined,
  year: undefined,
  categoryLabel: undefined,
  categoryAccentClass: "",
  icon: undefined,
  imageSrc: undefined,
  imageAlt: undefined,
  imageLayout: "top",
  background: "gray",
});

const hasLeftImageLayout = computed(() => props.imageSrc && props.imageLayout === "left");
</script>

<template>
  <div
    class="card-hover group overflow-hidden border border-gray-200 shadow-sm transition-transform duration-200 hover:-translate-y-1"
    :class="
      [
        props.background === 'white'
          ? 'bg-white'
          : props.background === 'blue'
            ? 'border-vsg-blue-700 bg-vsg-blue-600'
            : 'bg-gray-50',
        hasLeftImageLayout ? 'flex items-stretch' : '',
      ]
    "
  >
    <div
      v-if="props.imageSrc"
      class="relative overflow-hidden bg-gray-100"
      :class="hasLeftImageLayout ? 'w-28 shrink-0 self-stretch sm:w-32 md:w-40' : 'aspect-video'"
    >
      <img
        :src="props.imageSrc"
        :alt="props.imageAlt || props.title || ''"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="flex h-full min-w-0 flex-1 flex-col p-8">
      <div class="flex flex-col justify-center">
        <div
          v-if="$slots['meta-start'] || $slots['meta-end'] || props.year || props.categoryLabel"
          class="mb-5 flex items-start justify-between gap-4"
        >
          <div v-if="$slots['meta-start'] || props.year">
            <slot name="meta-start">
              <span class="font-display text-2xl text-vsg-gold-600">{{ props.year }}</span>
            </slot>
          </div>

          <div v-if="$slots['meta-end'] || props.categoryLabel">
            <slot name="meta-end">
              <Badge :accent-class="props.categoryAccentClass">{{ props.categoryLabel }}</Badge>
            </slot>
          </div>
        </div>

        <div v-if="!props.imageSrc && ($slots.icon || props.icon)" class="mb-6">
          <slot name="icon">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-lg bg-vsg-blue-600/10 text-vsg-blue-600 transition-colors group-hover:bg-vsg-blue-600/20"
            >
              <FontAwesomeIcon :icon="props.icon!" class="text-2xl" />
            </div>
          </slot>
        </div>

        <h4
          v-if="$slots.title || props.title"
          class="mb-3 font-display text-3xl tracking-wider text-vsg-blue-900"
        >
          <slot name="title">{{ props.title }}</slot>
        </h4>

        <template v-if="$slots.default">
          <slot />
        </template>
        <p
          v-else-if="props.description"
          class="font-body font-normal leading-relaxed text-gray-600"
        >
          {{ props.description }}
        </p>

        <div v-if="$slots.link" class="mt-6">
          <slot name="link" />
        </div>
      </div>
    </div>
  </div>
</template>
