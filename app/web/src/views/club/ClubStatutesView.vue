<script setup lang="ts">
import HeroSectionSmall from "@/components/content/HeroSectionSmall.vue";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      headline="SATZUNG"
      description="Die wichtigsten Grundlagen und Regeln unseres Vereins."
      headline-uuid="club-statutes-hero-headline"
      description-uuid="club-statutes-hero-description"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="space-y-6 font-body text-lg leading-relaxed text-vsg-blue-700">
          <p>Diese Seite wird aktuell vorbereitet.</p>
          <p>
            Hier findet ihr bald die Satzung und weiterfuehrende Informationen rund um den Verein.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
