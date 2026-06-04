<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import badmintonIcon from "@/assets/badminton.svg";
import gymnastikIcon from "@/assets/gymnastik.svg";
import tischtennisIcon from "@/assets/tischtennis.svg";
import volleyballIcon from "@/assets/volleyball.svg";
import EditableContent from "@/components/content/EditableContent.vue";
import Logo from "@/components/app/Logo.vue";

interface Props {
  tag?: string;
}

withDefaults(defineProps<Props>(), {
  tag: undefined,
});
</script>

<template>
  <section
    class="hero-section-screen relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
  >
    <div
      class="absolute inset-0 bg-linear-to-br from-vsg-blue-900 via-vsg-blue-800/50 to-transparent"
    />
    <div class="pulse-grid absolute inset-0 opacity-40" />
    <div class="spotlight spotlight-gold absolute -right-24 top-[12%] h-[28rem] w-[28rem]" />
    <div class="spotlight spotlight-blue absolute -left-28 bottom-[10%] h-[24rem] w-[24rem]" />
    <div
      class="spotlight spotlight-soft absolute left-1/2 top-[-6rem] h-[22rem] w-[34rem] -translate-x-1/2"
    />

    <div class="pointer-events-none absolute inset-0 z-0">
      <img :src="badmintonIcon" alt="" aria-hidden="true" class="sport-icon sport-icon-top-left" />
      <img :src="gymnastikIcon" alt="" aria-hidden="true" class="sport-icon sport-icon-top-right" />
      <img
        :src="tischtennisIcon"
        alt=""
        aria-hidden="true"
        class="sport-icon sport-icon-bottom-left"
      />
      <img
        :src="volleyballIcon"
        alt=""
        aria-hidden="true"
        class="sport-icon sport-icon-bottom-right"
      />
    </div>

    <div class="relative z-10 mx-auto max-w-7xl px-6 py-20 text-center">
      <div class="animate-slide-up my-8 delay-100">
        <Logo class="mx-auto h-24 w-auto md:h-32 lg:h-42" />
      </div>

      <div v-if="tag !== undefined" class="animate-slide-up my-8 delay-200">
        <span
          class="inline-block border border-vsg-gold-400/30 px-6 py-2 font-body font-normal uppercase tracking-widest text-vsg-gold-400"
        >
          <EditableContent uuid="68f283d4-d97c-4117-a020-4a77212a894d" :content="tag" />
        </span>
      </div>

      <div class="absolute bottom-1 left-1/2 -translate-x-1/2 animate-bounce">
        <FontAwesomeIcon icon="arrow-down" class="text-vsg-gold-400" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section-screen::before {
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

.sport-icon {
  position: absolute;
  width: clamp(7rem, 12vw, 12rem);
  opacity: 0.24;
  filter: drop-shadow(0 0 20px rgb(255 255 255 / 0.12));
  transform-origin: center;
}

.sport-icon-top-left {
  top: clamp(6rem, 12vw, 9rem);
  left: clamp(2.5rem, 7vw, 6rem);
  animation: sport-icon-float-a 12s ease-in-out infinite;
}

.sport-icon-top-right {
  top: clamp(6.5rem, 12vw, 9.5rem);
  right: clamp(2.5rem, 7vw, 6rem);
  animation: sport-icon-float-b 13s ease-in-out infinite;
}

.sport-icon-bottom-left {
  bottom: clamp(3.5rem, 8vw, 6rem);
  left: clamp(2.5rem, 8vw, 6rem);
  animation: sport-icon-float-c 14s ease-in-out infinite;
}

.sport-icon-bottom-right {
  right: clamp(2.5rem, 8vw, 6rem);
  bottom: clamp(3.5rem, 8vw, 6rem);
  animation: sport-icon-float-d 15s ease-in-out infinite;
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

@keyframes sport-icon-float-a {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-10deg) scale(1);
  }

  50% {
    transform: translate3d(0.75rem, 1rem, 0) rotate(-4deg) scale(1.08);
  }
}

@keyframes sport-icon-float-b {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(8deg) scale(1);
  }

  50% {
    transform: translate3d(-0.75rem, 1rem, 0) rotate(14deg) scale(1.06);
  }
}

@keyframes sport-icon-float-c {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(-6deg) scale(1);
  }

  50% {
    transform: translate3d(0.85rem, -0.85rem, 0) rotate(-12deg) scale(1.05);
  }
}

@keyframes sport-icon-float-d {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(10deg) scale(1);
  }

  50% {
    transform: translate3d(-0.85rem, -1rem, 0) rotate(4deg) scale(1.09);
  }
}
</style>
