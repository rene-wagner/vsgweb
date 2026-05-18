<script setup lang="ts">
import { computed } from "vue";
import EditableContent from "@/components/content/EditableContent.vue";
import MarkdownRenderer from "@/components/content/MarkdownRenderer.vue";

interface Props {
  headline?: string;
  description?: string;
  subtitle?: string;
  headlineUuid: string;
  descriptionUuid: string;
  subtitleUuid: string;
  editableHeadline?: boolean;
  editableDescription?: boolean;
  primaryCtaLabel?: string;
  primaryCtaAnchor?: string;
  secondaryCtaLabel?: string;
  secondaryCtaAnchor?: string;
}

const props = withDefaults(defineProps<Props>(), {
  headline: "",
  description: undefined,
  subtitle: undefined,
  editableHeadline: true,
  editableDescription: true,
  primaryCtaLabel: undefined,
  primaryCtaAnchor: undefined,
  secondaryCtaLabel: undefined,
  secondaryCtaAnchor: undefined,
});

const hasCtaButtons = computed(() => {
  return (
    (props.primaryCtaLabel && props.primaryCtaAnchor) ||
    (props.secondaryCtaLabel && props.secondaryCtaAnchor)
  );
});

function handleAnchorClick(e: MouseEvent, anchor: string) {
  if (anchor.startsWith("#")) {
    const target = document.querySelector(anchor);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", anchor);
    }
  }
}
</script>

<template>
  <section
    class="hero-section-small relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-20"
  >
    <div
      class="absolute inset-0 bg-linear-to-br from-vsg-blue-900 via-vsg-blue-800/50 to-transparent"
    />
    <div class="pulse-grid absolute inset-0 opacity-40" />
    <div class="spotlight spotlight-gold absolute -right-24 top-[12%] h-[24rem] w-[24rem]" />
    <div class="spotlight spotlight-blue absolute -left-28 bottom-[8%] h-[20rem] w-[20rem]" />
    <div
      class="spotlight spotlight-soft absolute left-1/2 top-[-5rem] h-[18rem] w-[28rem] -translate-x-1/2"
    />

    <div class="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
      <h1
        v-if="headline"
        class="hero-headline animate-slide-up text-glow mx-auto max-w-[12ch] text-center font-display text-[clamp(2.5rem,10vw,6rem)] text-white delay-300 lg:max-w-none"
      >
        <EditableContent v-if="editableHeadline" :uuid="headlineUuid" :content="headline" />
        <span v-else>{{ headline }}</span>
      </h1>

      <div v-if="description" class="animate-slide-up mx-auto mt-8 max-w-2xl delay-400">
        <EditableContent
          v-if="editableDescription"
          :uuid="descriptionUuid"
          :content="description"
          class="whitespace-pre-line font-body text-lg font-normal text-vsg-blue-300 md:text-xl"
        />
        <MarkdownRenderer
          v-else
          :content="description"
          content-class="whitespace-pre-line font-body text-lg font-normal text-vsg-blue-300 md:text-xl"
          :use-default-class="false"
        />
      </div>

      <div v-if="subtitle" class="animate-slide-up mx-auto mt-8 max-w-2xl delay-400">
        <EditableContent
          :uuid="subtitleUuid"
          :content="subtitle"
          class="font-body text-lg font-normal text-vsg-gold-400 md:text-xl"
        />
      </div>

      <div
        v-if="hasCtaButtons"
        class="animate-slide-up mt-12 flex flex-col items-center justify-center gap-6 delay-400 sm:flex-row"
      >
        <a
          v-if="primaryCtaLabel && primaryCtaAnchor"
          :href="primaryCtaAnchor"
          class="btn-primary gold-glow rounded-md bg-vsg-gold-400 px-10 py-4 font-display text-2xl tracking-wider text-vsg-blue-900"
          @click="handleAnchorClick($event, primaryCtaAnchor)"
        >
          {{ primaryCtaLabel }}
        </a>
        <a
          v-if="secondaryCtaLabel && secondaryCtaAnchor"
          :href="secondaryCtaAnchor"
          class="rounded-md border-2 border-vsg-gold-400/50 px-10 py-4 font-display text-2xl tracking-wider text-vsg-gold-400 transition-colors hover:bg-vsg-gold-400/10"
          @click="handleAnchorClick($event, secondaryCtaAnchor)"
        >
          {{ secondaryCtaLabel }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section-small::before {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% -10%, rgb(250 204 21 / 0.2), transparent 35%);
  content: "";
  opacity: 0.85;
}

.pulse-grid {
  background-image:
    linear-gradient(rgb(255 255 255 / 0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.12) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: linear-gradient(to bottom, rgb(0 0 0 / 0.9), transparent 90%);
  animation: grid-pulse 4.5s ease-in-out infinite;
}

.spotlight {
  border-radius: 9999px;
  filter: blur(70px);
  pointer-events: none;
}

.spotlight-gold {
  background: radial-gradient(
    circle,
    rgb(250 204 21 / 0.28),
    rgb(250 204 21 / 0.14) 38%,
    transparent 72%
  );
  animation: spotlight-drift-a 11s ease-in-out infinite;
}

.spotlight-blue {
  background: radial-gradient(
    circle,
    rgb(59 130 246 / 0.25),
    rgb(29 78 216 / 0.14) 42%,
    transparent 72%
  );
  animation: spotlight-drift-b 13s ease-in-out infinite;
}

.spotlight-soft {
  background: radial-gradient(
    circle,
    rgb(255 255 255 / 0.14),
    rgb(250 204 21 / 0.08) 36%,
    transparent 70%
  );
  animation: spotlight-drift-c 15s ease-in-out infinite;
}

.hero-headline {
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

.hero-headline :deep(*) {
  text-align: center;
  overflow-wrap: inherit;
  word-break: inherit;
  hyphens: inherit;
}

@media (min-width: 1024px) {
  .hero-headline {
    overflow-wrap: normal;
    word-break: normal;
    hyphens: none;
  }
}

@keyframes grid-pulse {
  0%,
  100% {
    opacity: 0.28;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.02);
  }
}

@keyframes spotlight-drift-a {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
  }

  30% {
    transform: translate3d(-3rem, 2.5rem, 0) scale(1.08) rotate(-4deg);
  }

  65% {
    transform: translate3d(2rem, -1.75rem, 0) scale(1.16) rotate(3deg);
  }
}

@keyframes spotlight-drift-b {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
  }

  35% {
    transform: translate3d(3.5rem, -2.5rem, 0) scale(1.14) rotate(5deg);
  }

  70% {
    transform: translate3d(-2rem, 2rem, 0) scale(1.08) rotate(-3deg);
  }
}

@keyframes spotlight-drift-c {
  0%,
  100% {
    transform: translate3d(-50%, 0, 0) scale(1) rotate(0deg);
    opacity: 0.45;
  }

  25% {
    transform: translate3d(calc(-50% - 2.5rem), 1.5rem, 0) scale(1.06) rotate(-3deg);
    opacity: 0.58;
  }

  60% {
    transform: translate3d(calc(-50% + 3rem), 2.5rem, 0) scale(1.14) rotate(4deg);
    opacity: 0.78;
  }
}
</style>
