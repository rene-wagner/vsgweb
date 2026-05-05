<script setup lang="ts">
import MembershipApplicationForm from "@/components/forms/MembershipApplicationForm.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";

const heroHeadline = "Aufnahmeantrag";
const heroDescription =
  "Bereite hier den digitalen Aufnahmeantrag für den Verein vor. Der Online-Versand wird aktuell noch eingerichtet.";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="heroHeadline"
      :description="heroDescription"
      headline-uuid="membership-application-headline"
      description-uuid="membership-application-description"
      subtitle-uuid="membership-application-subtitle"
      :editable-headline="false"
      :editable-description="false"
      primary-cta-label="Zum Formular"
      primary-cta-anchor="#mitgliedsantrag-formular"
      secondary-cta-label="Beitragsordnung"
      secondary-cta-anchor="/verein/beitragsordnung"
    />

    <section id="mitgliedsantrag-formular" class="bg-white py-16">
      <div class="mx-auto max-w-5xl px-6">
        <div class="mb-10 max-w-3xl text-vsg-blue-900">
          <h2 class="font-display text-3xl tracking-wider md:text-4xl">Digital vorbereitet</h2>
          <p class="mt-4 font-body text-lg leading-relaxed text-vsg-blue-700">
            Diese Seite bildet den bisherigen Aufnahmeantrag bereits digital ab. Interne Felder des
            Vereins, etwa zur Befürwortung oder zum Vorstandsbeschluss, sind hier bewusst nicht
            enthalten.
          </p>
        </div>

        <MembershipApplicationForm />
      </div>
    </section>
  </div>
</template>
