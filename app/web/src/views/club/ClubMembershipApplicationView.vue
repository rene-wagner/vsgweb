<script setup lang="ts">
import MembershipApplicationForm from "@/components/forms/MembershipApplicationForm.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";

const heroHeadline = "Aufnahmeantrag";
const heroDescription =
  "Fülle hier den digitalen Aufnahmeantrag für den Verein aus und sende ihn direkt an den Verein.";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="heroHeadline"
      :description="heroDescription"
      headline-uuid="11efd754-cacd-4c62-9a34-0c36444caba3"
      description-uuid="f6d749da-3c43-406e-a687-16b495ffd2b4"
      subtitle-uuid="bfe0eaac-fca7-4bb5-ab4b-e56ef0e99237"
    />

    <section id="mitgliedsantrag-formular" class="bg-white py-16">
      <div class="mx-auto max-w-5xl px-6">
        <MembershipApplicationForm />
      </div>
    </section>
  </div>
</template>
