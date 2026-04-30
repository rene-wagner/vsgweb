<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'TITLE',
  },
  description: {
    type: String,
    default:
      'DESCRIPTION',
  },
  href: {
    type: String,
    default: '#volleyball',
  },
  ctaLabel: {
    type: String,
    default: 'Jetzt ansehen',
  },
})
</script>

<template>
  <article
    class="card-spotlight group relative overflow-hidden border border-vsg-blue-700 hover:shadow-2xl bg-vsg-blue-600 p-6 text-white transition duration-200 hover:-translate-y-1 sm:p-7"
  >
    <div class="pulse-grid absolute inset-0 opacity-50"></div>
    <div class="spotlight-beam absolute -inset-x-20 -top-24 h-56 rotate-6 blur-2xl"></div>
    <div class="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-[#fde047]/80 to-transparent"></div>

    <div class="relative flex h-full flex-col">
      <div class="flex items-start justify-between gap-4">
        <div
          class="floating-badge flex h-14 w-14 items-center justify-center rounded-full border border-[#fef9c3]/20 bg-[#fcd34d]/12 text-[#fef9c3] shadow-[0_0_36px_rgba(251,191,36,0.2)]"
        >
          ICON
        </div>
      </div>

      <div class="mt-8">
        <h2 class="mt-3 text-3xl font-semibold tracking-tight text-white">
          TITEL
        </h2>
        <p class="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
          DESCRIPTION
        </p>
      </div>

      <div class="mt-8 flex items-center justify-between gap-4 pt-5">
        <a
          :href="props.href"
          class="inline-flex items-center gap-2 rounded-full bg-[#fcd34d] px-4 py-2 text-sm font-semibold text-[#001a3a] transition hover:bg-[#fde047] hover:tracking-[0.08em]"
        >
          {{ props.ctaLabel }}
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
  background: radial-gradient(circle, rgba(255, 255, 255, 0.32), rgba(252, 211, 77, 0.22) 30%, rgba(0, 102, 214, 0.12) 55%, transparent 70%);
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
