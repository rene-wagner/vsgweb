<script setup lang="ts">
import { computed } from "vue";
import type { DepartmentColor } from "@vsg/types";
import DepartmentIcon from "@/components/department/DepartmentIcon.vue";

interface Props {
  title: string;
  description: string;
  href: string;
  ctaLabel?: string;
  iconUrl?: string;
  iconAlt?: string;
  color?: DepartmentColor;
}

const props = withDefaults(defineProps<Props>(), {
  ctaLabel: "Mehr erfahren",
  iconUrl: undefined,
  iconAlt: undefined,
  color: "blue",
});

const colorClasses = computed(() => {
  switch (props.color) {
    case "purple":
      return {
        card: "border-purple-800 bg-purple-700",
        beam: "rgba(216, 180, 254, 0.32), rgba(250, 204, 21, 0.20) 30%, rgba(147, 51, 234, 0.18) 55%, transparent 70%",
      };
    case "green":
      return {
        card: "border-emerald-800 bg-emerald-700",
        beam: "rgba(187, 247, 208, 0.32), rgba(250, 204, 21, 0.20) 30%, rgba(16, 185, 129, 0.18) 55%, transparent 70%",
      };
    case "red":
      return {
        card: "border-rose-800 bg-rose-700",
        beam: "rgba(254, 205, 211, 0.32), rgba(250, 204, 21, 0.20) 30%, rgba(244, 63, 94, 0.18) 55%, transparent 70%",
      };
    case "blue":
    default:
      return {
        card: "border-vsg-blue-700 bg-vsg-blue-600",
        beam: "rgba(255, 255, 255, 0.32), rgba(252, 211, 77, 0.22) 30%, rgba(0, 102, 214, 0.12) 55%, transparent 70%",
      };
  }
});

const beamStyle = computed(() => ({
  background: `radial-gradient(circle, ${colorClasses.value.beam})`,
}));
</script>

<template>
  <article
    :class="[
      colorClasses.card,
      'card-spotlight group relative overflow-hidden border p-6 text-white transition duration-200 hover:-translate-y-1 hover:shadow-2xl sm:p-7',
    ]"
  >
    <div class="pulse-grid absolute inset-0 opacity-50" />
    <div class="spotlight-beam absolute -inset-x-20 -top-24 h-56 rotate-6 blur-2xl" :style="beamStyle" />
    <div
      class="absolute inset-x-6 bottom-0 h-px bg-linear-to-r from-transparent via-[#fde047]/80 to-transparent"
    />

    <div class="relative flex h-full flex-col">
      <div class="flex items-start justify-between gap-4">
        <div class="floating-badge">
          <DepartmentIcon :icon-url="iconUrl" :alt="iconAlt || title" :color="color" />
        </div>
      </div>

      <div class="mt-8 flex-1">
        <h2 class="mt-3 text-3xl font-display tracking-wider text-white">
          {{ title }}
        </h2>
        <p class="mt-4 font-body text-sm leading-7 text-slate-200 sm:text-base">
          {{ description }}
        </p>
      </div>

      <div class="mt-8 flex items-center justify-between gap-4 pt-5">
        <a
          :href="href"
          class="inline-flex items-center gap-2 rounded-full bg-[#fcd34d] px-4 py-2 text-sm font-semibold text-[#001a3a] transition hover:bg-[#fde047] hover:tracking-[0.08em]"
        >
          {{ ctaLabel }}
        </a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card-spotlight::before {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% -10%, rgba(254, 240, 138, 0.24), transparent 35%);
  content: "";
  opacity: 0.85;
}

.pulse-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), transparent 90%);
  animation: grid-pulse 3.8s ease-in-out infinite;
}

.spotlight-beam {
  animation: beam-sweep 6s ease-in-out infinite;
}

.floating-badge {
  animation: badge-float 4.6s ease-in-out infinite;
}

@keyframes badge-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-8px) rotate(4deg);
  }
}

@keyframes grid-pulse {
  0%,
  100% {
    opacity: 0.26;
    transform: scale(1);
  }

  50% {
    opacity: 0.58;
    transform: scale(1.02);
  }
}

@keyframes beam-sweep {
  0%,
  100% {
    transform: translateX(-16%) translateY(0) rotate(6deg);
    opacity: 0.5;
  }

  50% {
    transform: translateX(16%) translateY(12px) rotate(-4deg);
    opacity: 0.95;
  }
}
</style>
