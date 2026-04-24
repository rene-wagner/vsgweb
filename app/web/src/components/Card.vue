<script setup lang="ts">
import LinkArrow from "@/components/LinkArrow.vue";

interface Props {
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  description: undefined,
  href: undefined,
  linkLabel: "Mehr erfahren",
  imageSrc: undefined,
  imageAlt: undefined,
});
</script>

<template>
  <div class="card-hover group overflow-hidden border border-gray-200 bg-gray-50">
    <div v-if="props.imageSrc" class="relative aspect-video">
      <img
        :src="props.imageSrc"
        :alt="props.imageAlt || props.title"
        class="h-full w-full object-cover"
      />
    </div>

    <div class="p-8">
      <div
        v-if="!props.imageSrc"
        class="mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-vsg-blue-600/10 transition-colors group-hover:bg-vsg-blue-600/20"
      >
        <slot name="icon">
          <FontAwesomeIcon icon="circle" class="text-vsg-blue-600" />
        </slot>
      </div>

      <h4 class="mb-3 font-display text-3xl tracking-wider text-vsg-blue-900">
        {{ props.title }}
      </h4>

      <p v-if="props.description" class="font-body font-normal leading-relaxed text-gray-600">
        {{ props.description }}
      </p>

      <slot />

      <LinkArrow v-if="props.href" :href="props.href" class="mt-6">{{ props.linkLabel }}</LinkArrow>
    </div>
  </div>
</template>
